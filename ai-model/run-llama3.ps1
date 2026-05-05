# Run Llama 3 locally with Ollama
# Requires Ollama installed and available in PATH.

Set-Location "$PSScriptRoot"

Write-Host 'Starting Ollama Llama 3...'
Write-Host 'Run this in a terminal and follow Ollama output.'

ollama run llama3
