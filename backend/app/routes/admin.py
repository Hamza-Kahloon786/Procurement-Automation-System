from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from app.models.user import UserResponse
from app.database import get_database
from app.routes.auth import get_current_user
from app.utils.helpers import serialize_objectid

router = APIRouter(prefix="/admin", tags=["Admin"])

def verify_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this endpoint")
    return current_user

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: dict = Depends(verify_admin)):
    from datetime import datetime
    db = await get_database()
    
    cursor = db.users.find({}).sort("created_at", -1)
    users = await cursor.to_list(length=1000)
    
    return [
        UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            role=user["role"],
            company=user["company"],
            phone=user.get("phone"),
            verified=user["verified"],
            created_at=user.get("created_at") or datetime.utcnow()  # Provide default if missing
        )
        for user in users
    ]

@router.post("/users/{user_id}/verify")
async def verify_user(user_id: str, current_user: dict = Depends(verify_admin)):
    db = await get_database()
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"verified": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User verified successfully"}

@router.post("/users/{user_id}/unverify")
async def unverify_user(user_id: str, current_user: dict = Depends(verify_admin)):
    db = await get_database()
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"verified": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User unverified successfully"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(verify_admin)):
    db = await get_database()
    
    # Prevent self-deletion
    if str(current_user["_id"]) == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

@router.get("/stats")
async def get_system_stats(current_user: dict = Depends(verify_admin)):
    db = await get_database()
    
    # Count users by role
    total_buyers = await db.users.count_documents({"role": "buyer"})
    total_vendors = await db.users.count_documents({"role": "vendor"})
    pending_vendors = await db.users.count_documents({"role": "vendor", "verified": False})
    
    # Count requests
    total_requests = await db.procurement_requests.count_documents({})
    open_requests = await db.procurement_requests.count_documents({"status": "open"})
    closed_requests = await db.procurement_requests.count_documents({"status": "closed"})
    awarded_requests = await db.procurement_requests.count_documents({"status": "awarded"})
    
    # Count quotations
    total_quotations = await db.quotations.count_documents({})
    submitted_quotations = await db.quotations.count_documents({"status": "submitted"})
    accepted_quotations = await db.quotations.count_documents({"status": "accepted"})
    
    return {
        "users": {
            "total_buyers": total_buyers,
            "total_vendors": total_vendors,
            "pending_vendors": pending_vendors
        },
        "requests": {
            "total": total_requests,
            "open": open_requests,
            "closed": closed_requests,
            "awarded": awarded_requests
        },
        "quotations": {
            "total": total_quotations,
            "submitted": submitted_quotations,
            "accepted": accepted_quotations
        }
    }

@router.get("/recent-activity")
async def get_recent_activity(current_user: dict = Depends(verify_admin)):
    db = await get_database()
    
    # Recent requests
    recent_requests = await db.procurement_requests.find().sort("posted_at", -1).limit(5).to_list(5)
    
    # Recent quotations
    recent_quotations = await db.quotations.find().sort("submitted_at", -1).limit(5).to_list(5)
    
    # Recent users
    recent_users = await db.users.find().sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "recent_requests": [serialize_objectid(r) for r in recent_requests],
        "recent_quotations": [serialize_objectid(q) for q in recent_quotations],
        "recent_users": [serialize_objectid(u) for u in recent_users]
    }