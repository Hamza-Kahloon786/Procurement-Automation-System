from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "procurement_portal"
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    llama_model_path: str = "./models/llama-model"
    upload_dir: str = "./uploads"
    max_file_size: int = 10485760
    
    # Google Cloud Vision API (optional - for better PDF extraction)
    google_application_credentials: Optional[str] = None  # Path to service account JSON
    google_credentials_json: Optional[str] = None  # JSON string of credentials
    
    class Config:
        env_file = ".env"

settings = Settings()