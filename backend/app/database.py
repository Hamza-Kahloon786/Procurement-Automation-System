from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING, DESCENDING
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    
db = Database()

async def get_database():
    return db.client[settings.database_name]

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    database = db.client[settings.database_name]
    
    # Create indexes
    await database.users.create_index([("email", ASCENDING)], unique=True)
    await database.procurement_requests.create_index([("status", ASCENDING)])
    await database.procurement_requests.create_index([("buyer_id", ASCENDING)])
    await database.quotations.create_index([("request_id", ASCENDING)])
    await database.quotations.create_index([("vendor_id", ASCENDING)])
    
    print("Connected to MongoDB")

async def close_mongo_connection():
    db.client.close()
    print("Closed MongoDB connection")

def get_gridfs_bucket():
    database = db.client[settings.database_name]
    return AsyncIOMotorGridFSBucket(database)