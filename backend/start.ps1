Write-Host "Starting Procurement Portal Backend Server..." -ForegroundColor Green
Write-Host ""

# Set environment variables
$env:MONGODB_URL = "mongodb://localhost:27017"
$env:DATABASE_NAME = "procurement_portal"
$env:SECRET_KEY = "your-secret-key-change-in-production"  
$env:LLAMA_MODEL_PATH = "./models/llama-model"

Write-Host "Environment variables configured" -ForegroundColor Yellow
Write-Host "MongoDB URL: $env:MONGODB_URL" -ForegroundColor Gray
Write-Host "Database: $env:DATABASE_NAME" -ForegroundColor Gray
Write-Host ""

# Change to backend directory
Set-Location $PSScriptRoot

# Activate virtual environment and start server
Write-Host "Starting Uvicorn server on http://0.0.0.0:8000..." -ForegroundColor Cyan
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host ""

& .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

