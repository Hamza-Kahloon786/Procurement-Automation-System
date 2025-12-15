import json
from typing import Dict, Any
from app.services.pdf_processor import PDFProcessor

class QuotationExtractorService:
    """
    Intelligent quotation extraction service using OCR and pattern matching
    No AI model needed - works perfectly on any Windows PC!
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(QuotationExtractorService, cls).__new__(cls)
        return cls._instance
    
    async def extract_quotation_data(self, pdf_text: str, tables: list) -> Dict[str, Any]:
        """
        Extract structured quotation data from PDF text and tables
        Uses intelligent pattern matching - no AI model required
        """
        try:
            # Use PDF processor to parse everything
            extracted_data = await PDFProcessor.parse_quotation_structure(pdf_text, tables)
            
            return {
                "vendor_name": extracted_data.get("vendor_name", "Unknown Vendor"),
                "items": extracted_data.get("items", []),
                "delivery_time_days": extracted_data.get("delivery_time_days"),
                "payment_terms": extracted_data.get("payment_terms"),
                "total_amount": extracted_data.get("total_amount", 0.0),
                "extraction_method": "OCR + Pattern Matching"
            }
            
        except Exception as e:
            print(f"Extraction error: {e}")
            return self._create_basic_quotation(pdf_text)
    
    def _create_basic_quotation(self, text: str) -> Dict[str, Any]:
        """Create basic quotation from text when parsing fails"""
        prices = PDFProcessor.extract_prices(text)
        vendor = PDFProcessor.extract_vendor_name(text)
        
        return {
            "vendor_name": vendor,
            "items": [
                {
                    "product_name": "Quoted Product",
                    "quantity": 1,
                    "unit_price": prices[0] if prices else 0,
                    "total_price": prices[0] if prices else 0,
                    "brand": None,
                    "warranty": None
                }
            ],
            "delivery_time_days": None,
            "payment_terms": None,
            "total_amount": prices[0] if prices else 0,
            "extraction_method": "Basic Extraction"
        }
    
    async def compare_quotations(self, quotations: list) -> str:
        """
        Generate intelligent comparison of quotations
        Uses rule-based logic - no AI needed
        """
        if not quotations or len(quotations) < 2:
            return "Not enough quotations to compare."
        
        try:
            # Sort by total amount
            sorted_by_price = sorted(quotations, key=lambda x: x.get('total_amount', float('inf')))
            
            cheapest = sorted_by_price[0]
            most_expensive = sorted_by_price[-1]
            
            # Sort by delivery time
            with_delivery = [q for q in quotations if q.get('delivery_time_days') is not None]
            
            comparison = f"**Price Analysis:**\n"
            comparison += f"• Cheapest: {cheapest.get('vendor_name', 'Unknown')} - Rs. {cheapest.get('total_amount', 0):,.2f}\n"
            comparison += f"• Most Expensive: {most_expensive.get('vendor_name', 'Unknown')} - Rs. {most_expensive.get('total_amount', 0):,.2f}\n"
            
            if len(sorted_by_price) > 1:
                price_diff = most_expensive.get('total_amount', 0) - cheapest.get('total_amount', 0)
                price_diff_percent = (price_diff / cheapest.get('total_amount', 1)) * 100
                comparison += f"• Price Difference: Rs. {price_diff:,.2f} ({price_diff_percent:.1f}%)\n\n"
            
            if with_delivery:
                fastest = min(with_delivery, key=lambda x: x.get('delivery_time_days', 999))
                comparison += f"**Delivery Analysis:**\n"
                comparison += f"• Fastest Delivery: {fastest.get('vendor_name', 'Unknown')} - {fastest.get('delivery_time_days')} days\n\n"
            
            # Recommendation logic
            comparison += f"**Recommendation:**\n"
            
            if cheapest == fastest if with_delivery else True:
                comparison += f"✅ {cheapest.get('vendor_name', 'Unknown')} offers the best overall value "
                comparison += f"with the lowest price"
                if with_delivery and cheapest in with_delivery:
                    comparison += f" and competitive delivery time ({cheapest.get('delivery_time_days')} days)"
                comparison += ".\n"
            else:
                comparison += f"• Choose {cheapest.get('vendor_name', 'Unknown')} for best price (Rs. {cheapest.get('total_amount', 0):,.2f})\n"
                if with_delivery:
                    comparison += f"• Choose {fastest.get('vendor_name', 'Unknown')} for fastest delivery ({fastest.get('delivery_time_days')} days)\n"
            
            comparison += f"\n💡 *Consider payment terms and vendor reputation before final decision.*"
            
            return comparison
            
        except Exception as e:
            print(f"Comparison error: {e}")
            return "Unable to generate detailed comparison. Please review quotations manually."
    
    def analyze_quotation_quality(self, quotation: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze the completeness and quality of extracted data"""
        
        score = 0
        max_score = 5
        feedback = []
        
        # Check vendor name
        if quotation.get('vendor_name') and quotation['vendor_name'] != "Unknown Vendor":
            score += 1
        else:
            feedback.append("Vendor name not detected")
        
        # Check items
        if quotation.get('items') and len(quotation['items']) > 0:
            score += 1
            if all(item.get('product_name') != "Unknown Product" for item in quotation['items']):
                score += 0.5
        else:
            feedback.append("No items detected")
        
        # Check pricing
        if quotation.get('total_amount', 0) > 0:
            score += 1
        else:
            feedback.append("No pricing information found")
        
        # Check delivery time
        if quotation.get('delivery_time_days') is not None:
            score += 1
        else:
            feedback.append("Delivery time not specified")
        
        # Check payment terms
        if quotation.get('payment_terms'):
            score += 0.5
        
        quality_percentage = (score / max_score) * 100
        
        return {
            "quality_score": round(quality_percentage, 1),
            "completeness": "Excellent" if quality_percentage >= 80 else 
                          "Good" if quality_percentage >= 60 else 
                          "Fair" if quality_percentage >= 40 else "Poor",
            "feedback": feedback,
            "recommendations": self._get_improvement_tips(feedback)
        }
    
    def _get_improvement_tips(self, feedback: list) -> list:
        """Provide tips for improving quotation quality"""
        tips = []
        
        if "Vendor name not detected" in feedback:
            tips.append("Ensure vendor/company name is clearly visible at top of quotation")
        
        if "No items detected" in feedback:
            tips.append("Use a clear table format for items with columns: Item, Qty, Price")
        
        if "No pricing information found" in feedback:
            tips.append("Clearly mark prices with Rs. or $ symbols")
        
        if "Delivery time not specified" in feedback:
            tips.append("Include delivery time in format: 'Delivery: X days'")
        
        return tips


# Create singleton instance
quotation_extractor = QuotationExtractorService()

# Keep old name for backward compatibility
llama_service = quotation_extractor