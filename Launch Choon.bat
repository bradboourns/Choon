@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo Launching Choon...

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is required but was not found.
  echo Please install Node.js 20+ from https://nodejs.org/ and run this launcher again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

if not exist .env.local (
  echo Creating .env.local...
  (
    echo AUTH_SECRET=change-me-in-production
    echo NEXT_PUBLIC_BASE_URL=http://localhost:3000
    echo DATABASE_URL=file:./data/choon.db
  ) > .env.local
)

start "" http://localhost:3000
call npm run dev
