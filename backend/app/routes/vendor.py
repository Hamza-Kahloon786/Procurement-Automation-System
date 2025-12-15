from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List
from bson import ObjectId
from datetime import datetime
from app.models.request import ProcurementRequestResponse
from app.models.quotation import QuotationResponse, PDFFile
from app.database import get_database, get_gridfs_bucket
from app.routes.auth import get_current_user
from app.utils.helpers import serialize_objectid
from app.services.pdf_processor import PDFProcessor
from app.services.llama_service import llama_service

router = APIRouter(prefix="/vendor", tags=["Vendor"])

def verify_vendor(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "vendor":
        raise HTTPException(status_code=403, detail="Only vendors can access this endpoint")
    return current_user

@router.get("/requests", response_model=List[ProcurementRequestResponse])
async def get_open_requests(current_user: dict = Depends(verify_vendor)):
    db = await get_database()
    
    cursor = db.procurement_requests.find({"status": "open"}).sort("posted_at", -1)
    requests = await cursor.to_list(length=100)
    
    # Get buyer info for each request
    result = []
    for req in requests:
        buyer = await db.users.find_one({"_id": req["buyer_id"]})
        
        result.append(
            ProcurementRequestResponse(
                id=str(req["_id"]),
                buyer_id=str(req["buyer_id"]),
                title=req["title"],
                description=req.get("description"),
                items_needed=req["items_needed"],
                budget=req["budget"],
                deadline=req["deadline"],
                status=req["status"],
                quotations_received=req["quotations_received"],
                posted_at=req["posted_at"],
                buyer_name=buyer["name"] if buyer else None,
                buyer_company=buyer["company"] if buyer else None
            )
        )
    
    return result

@router.post("/quotations/submit")
async def submit_quotation(
    request_id: str = Form(...),
    pdf: UploadFile = File(...),
    current_user: dict = Depends(verify_vendor)
):
    db = await get_database()
    
    # Verify request exists and is open
    request = await db.procurement_requests.find_one({
        "_id": ObjectId(request_id),
        "status": "open"
    })
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found or closed")
    
    # Check if vendor already submitted
    existing = await db.quotations.find_one({
        "request_id": request_id,
        "vendor_id": current_user["_id"]
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted a quotation for this request")
    
    # Validate file
    if not pdf.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read PDF
    pdf_bytes = await pdf.read()
    
    # Store in GridFS
    fs = get_gridfs_bucket()
    grid_id = await fs.upload_from_stream(
        pdf.filename,
        pdf_bytes,
        metadata={"vendor_id": current_user["_id"], "request_id": request_id}
    )
    
    # Extract data from PDF using Google Vision API
    extracted_data = await PDFProcessor.process_pdf_complete(pdf_bytes)
    
    # Create quotation document
    quotation = {
        "request_id": request_id,
        "vendor_id": current_user["_id"],
        "vendor_name": current_user["company"],
        "pdf_file": {
            "filename": pdf.filename,
            "gridfs_id": str(grid_id),
            "uploaded_at": datetime.utcnow(),
            "extraction_confidence": 0.8
        },
        "items": extracted_data.get("items", []),
        "total_amount": extracted_data.get("total_amount", 0),
        "delivery_time_days": extracted_data.get("delivery_time_days"),
        "payment_terms": extracted_data.get("payment_terms"),
        "currency": "USD",
        "status": "submitted",
        "submitted_at": datetime.utcnow()
    }
    
    result = await db.quotations.insert_one(quotation)
    
    # Update request quotation counter
    await db.procurement_requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$inc": {"quotations_received": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    return {
        "quotation_id": str(result.inserted_id),
        "message": "Quotation submitted successfully",
        "extracted_items": len(quotation["items"])
    }

@router.get("/quotations", response_model=List[QuotationResponse])
async def get_my_quotations(current_user: dict = Depends(verify_vendor)):
    db = await get_database()
    
    cursor = db.quotations.find({"vendor_id": current_user["_id"]}).sort("submitted_at", -1)
    quotations = await cursor.to_list(length=100)
    
    return [
        QuotationResponse(
            id=str(quot["_id"]),
            request_id=quot["request_id"],
            vendor_id=str(quot["vendor_id"]),
            vendor_name=quot["vendor_name"],
            items=quot["items"],
            delivery_time_days=quot.get("delivery_time_days"),
            payment_terms=quot.get("payment_terms"),
            valid_until=quot.get("valid_until"),
            notes=quot.get("notes"),
            total_amount=quot["total_amount"],
            status=quot["status"],
            submitted_at=quot["submitted_at"],
            pdf_filename=quot["pdf_file"]["filename"]
        )
        for quot in quotations
    ]

@router.get("/quotations/{quotation_id}", response_model=QuotationResponse)
async def get_quotation_detail(
    quotation_id: str,
    current_user: dict = Depends(verify_vendor)
):
    db = await get_database()
    
    quotation = await db.quotations.find_one({
        "_id": ObjectId(quotation_id),
        "vendor_id": current_user["_id"]
    })
    
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    return QuotationResponse(
        id=str(quotation["_id"]),
        request_id=quotation["request_id"],
        vendor_id=str(quotation["vendor_id"]),
        vendor_name=quotation["vendor_name"],
        items=quotation["items"],
        delivery_time_days=quotation.get("delivery_time_days"),
        payment_terms=quotation.get("payment_terms"),
        valid_until=quotation.get("valid_until"),
        notes=quotation.get("notes"),
        total_amount=quotation["total_amount"],
        status=quotation["status"],
        submitted_at=quotation["submitted_at"],
        pdf_filename=quotation["pdf_file"]["filename"]
    )