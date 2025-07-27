# PowerShell script to start the CleanMatch frontend server
Write-Host "Starting CleanMatch Frontend Server..." -ForegroundColor Green

# Change to frontend directory
Set-Location "d:\Projects\MERN\CleanMatch\frontend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev
