"""
PDF Processor with Google Cloud Vision API for accurate document extraction.
Based on proven extraction logic from py_extractor.py
"""

import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
from io import BytesIO
import re
import os
import json
from typing import Dict, Any, List, Optional, Tuple

# Google Cloud Vision
try:
    from google.cloud import vision
    from google.oauth2 import service_account
    GOOGLE_VISION_AVAILABLE = True
except ImportError:
    GOOGLE_VISION_AVAILABLE = False
    print("⚠️ Google Cloud Vision not installed. Using fallback extraction.")


class PDFProcessor:
    """
    Advanced PDF processor with Google Cloud Vision API for accurate extraction.
    """
    
    # Credentials paths
    CREDENTIALS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'google-credentials.json')
    
    _vision_client = None
    
    @classmethod
    def get_vision_client(cls):
        """Get or create Google Vision client"""
        if cls._vision_client is not None:
            return cls._vision_client
        
        if not GOOGLE_VISION_AVAILABLE:
            print("❌ Google Vision library not available")
            return None
        
        try:
            if os.path.exists(cls.CREDENTIALS_FILE):
                print(f"✅ Found credentials: {cls.CREDENTIALS_FILE}")
                cls._vision_client = vision.ImageAnnotatorClient.from_service_account_file(
                    cls.CREDENTIALS_FILE
                )
                print("✅ Google Vision client initialized successfully!")
                return cls._vision_client
            else:
                print(f"❌ Credentials file not found: {cls.CREDENTIALS_FILE}")
                
            env_creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if env_creds and os.path.exists(env_creds):
                print(f"✅ Using env credentials: {env_creds}")
                cls._vision_client = vision.ImageAnnotatorClient.from_service_account_file(env_creds)
                return cls._vision_client
                
        except Exception as e:
            print(f"❌ Failed to initialize Vision client: {e}")
        
        return None

    @staticmethod
    def _extract_text_direct(pdf_bytes: bytes) -> Optional[str]:
        """Extract text directly using pdfplumber"""
        try:
            with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
                texts = []
                for page in pdf.pages:
                    page_text = page.extract_text() or ""
                    texts.append(page_text)
                
                full_text = "\n".join(texts)
                if full_text.strip():
                    return full_text
        except Exception as e:
            print(f"Direct PDF text extraction failed: {e}")
        
        return None

    @staticmethod
    def _extract_text_with_vision(pdf_bytes: bytes) -> Optional[str]:
        """Extract text using Google Vision API"""
        client = PDFProcessor.get_vision_client()
        if not client:
            return None
        
        try:
            # Try document_text_detection first (works with PDF bytes directly)
            response = client.document_text_detection({"content": pdf_bytes})
            annotation = response.full_text_annotation
            if annotation and annotation.text and annotation.text.strip():
                print("✅ Vision document_text_detection succeeded")
                return annotation.text
        except Exception as e:
            print(f"Vision document_text_detection failed: {e}")
        
        try:
            # Fallback to text_detection
            response = client.text_detection({"content": pdf_bytes})
            if response.text_annotations:
                text = response.text_annotations[0].description
                if text and text.strip():
                    print("✅ Vision text_detection succeeded")
                    return text
        except Exception as e:
            print(f"Vision text_detection failed: {e}")
        
        return None

    @staticmethod
    def _parse_money(s: Optional[str]) -> Optional[float]:
        """Parse money string to float"""
        if not s:
            return None
        try:
            return float(s.replace(",", "").replace("$", "").strip())
        except ValueError:
            return None

    @staticmethod
    def _parse_item_line(line: str) -> Optional[Dict[str, Any]]:
        """Parse compact item line format like: 'HeadThose...14$1,313.21$18,384.94'"""
        m = re.match(r"^(.+?\.)(\d+)\$?([\d,]+\.\d{2})\$?([\d,]+\.\d{2})$", line)
        if not m:
            return None
        
        item_text = m.group(1).strip().rstrip(".")
        try:
            qty = int(m.group(2))
            unit_price = float(m.group(3).replace(",", ""))
            total = float(m.group(4).replace(",", ""))
        except ValueError:
            return None
        
        if qty <= 0 or unit_price <= 0 or total <= 0:
            return None
        
        words = item_text.split()
        if not words:
            return None
        
        return {
            "product_name": item_text,
            "quantity": qty,
            "unit_price": unit_price,
            "total_price": total,
            "brand": None,
            "warranty": None
        }

    @staticmethod
    def _parse_item_line_spaced(line: str) -> Optional[Dict[str, Any]]:
        """Parse item lines where columns are separated by spaces.
        Example: 'Premium Wall Panel Installation 12 $980.00 $11,760.00'
        or: 'Basic Website Design - 5 pages 1 $450.00 $450.00'
        """
        # Find all numbers in the line
        numbers = re.findall(r"\$?([\d,]+\.?\d*)", line)
        if len(numbers) < 2:
            return None
        
        try:
            nums = [float(n.replace(",", "")) for n in numbers]
        except ValueError:
            return None
        
        # Filter out unreasonable numbers
        valid_nums = [n for n in nums if n > 0]
        if len(valid_nums) < 2:
            return None
        
        # First small integer is usually quantity
        qty = 1
        for n in nums:
            if n == int(n) and 0 < n < 100:
                qty = int(n)
                break
        
        # Unit price is first decimal number or second number
        unit_price = None
        for n in nums:
            if abs(n - round(n)) > 0.001:  # Has decimals (cents)
                unit_price = n
                break
        
        if unit_price is None and len(valid_nums) >= 2:
            # Take second number as unit price
            unit_price = valid_nums[1] if valid_nums[1] != qty else valid_nums[0]
        
        if unit_price is None or unit_price <= 0:
            return None
        
        # Total is the largest number
        total = max(valid_nums)
        
        # Remove numeric parts to get text (item name)
        text_part = re.sub(r"\$?[\d,]+\.?\d*", "", line).strip()
        text_part = re.sub(r"\s+", " ", text_part).strip()
        
        if len(text_part) < 3:
            return None
        
        # Clean up item name
        text_part = text_part.strip(" -–—:,.")
        
        return {
            "product_name": text_part,
            "quantity": qty,
            "unit_price": unit_price,
            "total_price": total,
            "brand": None,
            "warranty": None
        }

    @staticmethod
    def _parse_invoice_data(text: str) -> Dict[str, Any]:
        """Parse invoice/quotation text to extract structured data.
        Based on proven py_extractor.py logic.
        """
        data = {
            "vendor_name": None,
            "items": [],
            "subtotal": None,
            "tax_amount": None,
            "total_amount": None,
        }
        
        # Normalize text
        normalized = re.sub(r"[\t ]+", " ", text.replace("\r\n", "\n").replace("\r", "\n"))
        lines = [ln.strip() for ln in normalized.split("\n") if ln.strip()]
        
        # Extract company/vendor name from top lines
        for ln in lines[:10]:
            low = ln.lower()
            if not any(ch.isalpha() for ch in ln):
                continue
            # Skip non-company lines
            if any(kw in low for kw in (
                "phone", "email", "website", "quotation", "invoice", 
                "estimate", "bill to", "ship to", "to:", "fax",
                "date", "pr no", "po no", "receipt"
            )):
                continue
            # Skip address lines starting with number
            if re.match(r"^\d+\s", ln):
                continue
            # Skip short lines
            if len(ln) < 3:
                continue
            data["vendor_name"] = ln.strip()
            break
        
        # Extract subtotal
        subtotal_patterns = [
            re.compile(r"Sub[-\s]?total[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"Subtotal[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
        ]
        for pat in subtotal_patterns:
            m = pat.search(text)
            if m:
                data["subtotal"] = PDFProcessor._parse_money(m.group(1))
                break
        
        # Extract tax
        tax_patterns = [
            re.compile(r"Tax\s*\([^)]*\)[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"Tax[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"VAT[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"GST[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
        ]
        for pat in tax_patterns:
            m = pat.search(text)
            if m:
                data["tax_amount"] = PDFProcessor._parse_money(m.group(1))
                break
        
        # Extract grand total
        grand_patterns = [
            re.compile(r"Grand\s*Total[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"Total\s*Amount[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"Amount\s*Paid[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"Amount\s*Due[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I),
            re.compile(r"(?:^|\s)Total[.:]?\s*\$?\s*([\d,]+\.?\d*)", re.I | re.M),
        ]
        for pat in grand_patterns:
            m = pat.search(text)
            if m:
                data["total_amount"] = PDFProcessor._parse_money(m.group(1))
                break
        
        # Find item table header
        header_patterns = [
            re.compile(r"Item.*Description.*Qty.*(?:Unit\s*)?Price.*Total", re.I),
            re.compile(r"Description.*Qty.*(?:Unit\s*)?Price.*(?:Amount|Total)", re.I),
            re.compile(r"Item\s+Description.*Qty.*Unit\s*Price.*Total", re.I),
            re.compile(r"Particulars.*Qty.*Rate.*Amount", re.I),
        ]
        
        header_idx = -1
        for i, ln in enumerate(lines):
            for pat in header_patterns:
                if pat.search(ln):
                    header_idx = i
                    break
            if header_idx >= 0:
                break
        
        # Parse item rows after header
        if header_idx >= 0:
            for ln in lines[header_idx + 1:]:
                # Stop at totals section
                if re.search(r"Subtotal|Tax|Grand\s*Total|Amount\s*Due|Amount\s*Paid", ln, re.I):
                    if re.search(r"[\d,]+\.?\d{2}", ln):
                        break
                
                # Skip empty or non-text lines
                if len(ln) < 5 or not re.search(r"[A-Za-z]", ln):
                    continue
                
                # Skip header-like lines
                if re.search(r"^(Item|Description|Qty|Quantity|Price|Amount|Total|Unit)\s*$", ln, re.I):
                    continue
                
                # Try compact pattern first
                item = PDFProcessor._parse_item_line(ln)
                
                # Then try spaced-columns pattern
                if not item:
                    item = PDFProcessor._parse_item_line_spaced(ln)
                
                if item:
                    data["items"].append(item)
        
        # Fallback: try to find any lines with prices if no items found
        if not data["items"]:
            for ln in lines:
                # Skip known non-item lines
                low = ln.lower()
                if any(kw in low for kw in [
                    "subtotal", "sub total", "tax", "grand total", "total",
                    "amount due", "amount paid", "phone", "email", "website",
                    "address", "street", "city", "state", "zip", "date",
                    "invoice", "receipt", "quotation", "bill to", "ship to",
                    "prepared by", "signature", "thank you", "payment"
                ]):
                    continue
                
                # Try to parse as item line
                item = PDFProcessor._parse_item_line_spaced(ln)
                if item and item["product_name"] and len(item["product_name"]) > 3:
                    data["items"].append(item)
        
        return data

    @staticmethod
    async def extract_text_from_pdf(pdf_bytes: bytes) -> Tuple[str, List]:
        """Extract text from PDF using best available method"""
        
        # Try direct extraction first
        text = PDFProcessor._extract_text_direct(pdf_bytes)
        if text and text.strip():
            print("✅ Using direct pdfplumber extraction")
            return text, []
        
        # Try Vision API
        text = PDFProcessor._extract_text_with_vision(pdf_bytes)
        if text and text.strip():
            print("✅ Using Google Vision extraction")
            return text, []
        
        # Fallback to OCR
        try:
            images = convert_from_bytes(pdf_bytes)
            text = ""
            for image in images:
                text += pytesseract.image_to_string(image) + "\n"
            if text.strip():
                print("✅ Using OCR extraction")
                return text, []
        except Exception as e:
            print(f"❌ OCR failed: {e}")
        
        return "", []

    @staticmethod
    async def parse_quotation_structure(text: str, tables: List) -> Dict[str, Any]:
        """Parse quotation/invoice structure from text"""
        return PDFProcessor._parse_invoice_data(text)

    @staticmethod
    async def process_pdf_complete(pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Complete PDF processing - extract text and parse structure.
        Returns fully structured quotation data.
        """
        # Extract text
        text = PDFProcessor._extract_text_direct(pdf_bytes)
        
        if not text or not text.strip():
            text = PDFProcessor._extract_text_with_vision(pdf_bytes)
        
        if not text or not text.strip():
            # OCR fallback
            try:
                images = convert_from_bytes(pdf_bytes)
                text = ""
                for image in images:
                    text += pytesseract.image_to_string(image) + "\n"
            except:
                text = ""
        
        if not text:
            return {
                "vendor_name": "Unknown Vendor",
                "items": [],
                "total_amount": 0,
                "subtotal": None,
                "tax_amount": None,
                "delivery_time_days": None,
                "payment_terms": None,
            }
        
        # Parse the text
        parsed = PDFProcessor._parse_invoice_data(text)
        
        # Calculate items total if no grand total found
        items_total = sum(item.get("total_price", 0) for item in parsed.get("items", []))
        
        if not parsed.get("total_amount") and items_total > 0:
            parsed["total_amount"] = items_total
        
        # If still no items but have total, create a placeholder
        if not parsed.get("items") and parsed.get("total_amount"):
            parsed["items"] = [{
                "product_name": "Service/Product",
                "quantity": 1,
                "unit_price": parsed["total_amount"],
                "total_price": parsed["total_amount"],
                "brand": None,
                "warranty": None
            }]
        
        return {
            "vendor_name": parsed.get("vendor_name") or "Unknown Vendor",
            "items": parsed.get("items", []),
            "total_amount": parsed.get("total_amount") or 0,
            "subtotal": parsed.get("subtotal"),
            "tax_amount": parsed.get("tax_amount"),
            "delivery_time_days": None,
            "payment_terms": None,
            "raw_text": text[:3000] if text else "",
        }
