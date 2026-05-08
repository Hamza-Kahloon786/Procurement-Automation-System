from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, buyer, vendor, admin, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Procurement Portal API",
    description="API for Procurement Management System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS - Configure to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    # ✅ NEW (add your domain — keep localhost for local dev)
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://aipas.duckdns.org",
        "http://aipas.duckdns.org"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router)
app.include_router(buyer.router)
app.include_router(vendor.router)
app.include_router(admin.router)
app.include_router(chat.router)  # AI Chatbot routes

@app.get("/")
async def root():
    return {
        "message": "Procurement Portal API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}