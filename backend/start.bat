@echo off
echo Starting Procurement Portal Backend...
echo.

REM Set environment variables
set MONGODB_URL=mongodb://localhost:27017
set DATABASE_NAME=procurement_portal
set SECRET_KEY=your-secret-key-change-in-production
set LLAMA_MODEL_PATH=./models/llama-model

echo Environment variables set
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

echo Starting Uvicorn server on http://0.0.0.0:8000...
echo Press CTRL+C to stop the server
echo.

REM Start the server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

