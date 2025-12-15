@echo off
echo ===================================
echo Fixing Recharts Installation
echo ===================================
echo.

echo Step 1: Installing dependencies...
call npm install
echo.

echo Step 2: Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo Vite cache cleared.
) else (
    echo No Vite cache found.
)
echo.

echo Step 3: Verifying recharts installation...
call npm ls recharts
echo.

echo ===================================
echo Fix complete!
echo Now restart your dev server with: npm run dev
echo ===================================
pause


