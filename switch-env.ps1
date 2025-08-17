# PowerShell script to switch between local and production environments
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "production")]
    [string]$Environment
)

Write-Host "Switching to $Environment environment..." -ForegroundColor Green

# Switch frontend environment
if (Test-Path "frontend\.env.$Environment") {
    Copy-Item "frontend\.env.$Environment" "frontend\.env" -Force
    Write-Host "Frontend environment switched to $Environment" -ForegroundColor Yellow
} else {
    Write-Host "Frontend .env.$Environment file not found!" -ForegroundColor Red
}

# Switch backend environment
if (Test-Path "backend\.env.$Environment") {
    Copy-Item "backend\.env.$Environment" "backend\.env" -Force
    Write-Host "Backend environment switched to $Environment" -ForegroundColor Yellow
} else {
    Write-Host "Backend .env.$Environment file not found!" -ForegroundColor Red
}

Write-Host "Environment switch complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Current configuration:" -ForegroundColor Cyan
Write-Host "Frontend API URL: " -NoNewline
if (Test-Path "frontend\.env") {
    $apiUrl = Get-Content "frontend\.env" | Select-String "VITE_API_URL" | ForEach-Object { $_.Line.Split('=')[1] }
    Write-Host $apiUrl -ForegroundColor White
}
Write-Host "Backend NODE_ENV: " -NoNewline
if (Test-Path "backend\.env") {
    $nodeEnv = Get-Content "backend\.env" | Select-String "NODE_ENV" | ForEach-Object { $_.Line.Split('=')[1] }
    Write-Host $nodeEnv -ForegroundColor White
}
