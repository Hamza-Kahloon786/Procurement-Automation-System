@echo off
echo Creating admin user...
echo.

set MONGODB_URL=mongodb://localhost:27017
set DATABASE_NAME=procurement_portal

call venv\Scripts\activate.bat
python create_admin.py

pause

