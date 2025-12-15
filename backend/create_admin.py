"""
Script to create an admin user in the database
Run this with: python create_admin.py
"""
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import os

async def create_admin():
    # Database connection
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "procurement_portal")
    
    client = AsyncIOMotorClient(mongodb_url)
    db = client[database_name]
    
    # Admin credentials
    admin_email = "admin@procurement.com"
    admin_password = "admin123"  # Change this after first login!
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if existing_admin:
        print(f"✗ Admin user already exists with email: {admin_email}")
        print("If you need to reset the password, please delete the user from MongoDB first.")
        client.close()
        return
    
    # Create admin user
    # Hash password using bcrypt directly
    hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    admin_user = {
        "email": admin_email,
        "name": "System Administrator",
        "role": "admin",
        "company": "Procurement Portal",
        "phone": None,
        "hashed_password": hashed_password,
        "verified": True,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(admin_user)
    
    print("\n" + "="*60)
    print("✓ Admin user created successfully!")
    print("="*60)
    print(f"\nEmail:    {admin_email}")
    print(f"Password: {admin_password}")
    print("\n⚠️  IMPORTANT: Change this password after first login!")
    print("="*60 + "\n")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())

