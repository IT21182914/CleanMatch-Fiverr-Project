@echo off
if "%1"=="local" (
    powershell -ExecutionPolicy Bypass -File switch-env.ps1 -Environment local
) else if "%1"=="production" (
    powershell -ExecutionPolicy Bypass -File switch-env.ps1 -Environment production
) else (
    echo Usage: switch-env.bat [local^|production]
    echo.
    echo Examples:
    echo   switch-env.bat local      - Switch to local development environment
    echo   switch-env.bat production - Switch to production/hosted environment
)
