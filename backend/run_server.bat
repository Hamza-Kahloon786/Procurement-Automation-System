@echo off
cd /d "%~dp0"
set MONGODB_URL=mongodb://localhost:27017
set DATABASE_NAME=procurement_portal
set SECRET_KEY=your-secret-key-here-change-in-production
set LLAMA_MODEL_PATH=./models/llama-model
call venv\Scripts\activate.bat
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

