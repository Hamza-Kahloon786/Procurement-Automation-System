from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from bson import ObjectId

class ItemNeeded(BaseModel):
    product: str
    quantity: int
    specifications: Optional[str] = None

class ProcurementRequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    items_needed: List[ItemNeeded]
    budget: float
    deadline: datetime

class ProcurementRequestCreate(ProcurementRequestBase):
    pass

class ProcurementRequestInDB(ProcurementRequestBase):
    id: str = Field(alias="_id")
    buyer_id: str
    status: Literal["open", "closed", "awarded"] = "open"
    quotations_received: int = 0
    posted_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ProcurementRequestResponse(ProcurementRequestBase):
    id: str
    buyer_id: str
    status: str
    quotations_received: int
    posted_at: datetime
    buyer_name: Optional[str] = None
    buyer_company: Optional[str] = None
    
    class Config:
        from_attributes = True