# PowerShell script to start the CleanMatch backend server
Write-Host "Starting CleanMatch Backend Server..." -ForegroundColor Green

# Change to backend directory
Set-Location "d:\Projects\MERN\CleanMatch\backend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "Starting server on port 5000..." -ForegroundColor Green
npm start
