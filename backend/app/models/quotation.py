from pydantic import BaseModel, Field
from typing import Optional, List, Literal, Dict, Any
from datetime import datetime
from bson import ObjectId

class QuotationItem(BaseModel):
    product_name: str
    quantity: int
    unit_price: float
    total_price: float
    brand: Optional[str] = None
    warranty: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None

class PDFFile(BaseModel):
    filename: str
    gridfs_id: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    extraction_confidence: Optional[float] = None

class QuotationBase(BaseModel):
    items: List[QuotationItem]
    delivery_time_days: Optional[int] = None
    payment_terms: Optional[str] = None
    valid_until: Optional[datetime] = None
    notes: Optional[str] = None

class QuotationCreate(QuotationBase):
    request_id: str

class QuotationInDB(QuotationBase):
    id: str = Field(alias="_id")
    request_id: str
    vendor_id: str
    vendor_name: str
    pdf_file: PDFFile
    total_amount: float
    currency: str = "USD"
    status: Literal["submitted", "accepted", "rejected"] = "submitted"
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class QuotationResponse(QuotationBase):
    id: str
    request_id: str
    vendor_id: str
    vendor_name: str
    total_amount: float
    status: str
    submitted_at: datetime
    pdf_filename: Optional[str] = None
    
    class Config:
        from_attributes = True