@echo off
echo "Running Bing Search automation script..."

echo "Generating search terms..."
python generate_terms.py
if %errorlevel% neq 0 (
    echo "Error generating search terms."
    pause
    exit /b %errorlevel%
)

echo "Starting search..."
node index.js
if %errorlevel% neq 0 (
    echo "Error running the search script."
    pause
    exit /b %errorlevel%
)

echo "Script finished successfully."
pause