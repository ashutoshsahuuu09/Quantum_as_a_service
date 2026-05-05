$ErrorActionPreference = 'Stop'

Write-Host 'Setting up backend venv and dependencies...'
Set-Location "$PSScriptRoot\..\backend"
if (-Not (Test-Path '.venv')) { python -m venv .venv }
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Write-Host 'Setting up quantum-service venv and dependencies...'
Set-Location "$PSScriptRoot\..\quantum-service"
if (-Not (Test-Path '.venv')) { python -m venv .venv }
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Write-Host 'Installing frontend dependencies...'
Set-Location "$PSScriptRoot\..\frontend"
npm install

Write-Host 'Installing root dev runner dependencies...'
Set-Location "$PSScriptRoot\.."
npm install

Write-Host 'Setup complete. Run: npm run dev'
