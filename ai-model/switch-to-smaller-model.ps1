# Switch to smaller Ollama model for lower memory usage
# Run this in PowerShell to pull and use llama3.2 instead of llama3

Set-Location "$PSScriptRoot"

Write-Host 'Pulling smaller llama3.2 model (requires less RAM)...'
ollama pull llama3.2

Write-Host 'Setting llama3.2 as default model...'
# Note: You may need to update your .env file to use OLLAMA_MODEL=llama3.2

Write-Host 'Testing the model...'
ollama run llama3.2 "Hello, test message"