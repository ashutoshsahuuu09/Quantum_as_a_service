# AI Model Integration (Ollama / TinyLlama)

This folder contains scaffolding for adding a local Ollama-based AI model to this project.

## Goal

- Run `tinyllama` locally with Ollama (very small, ~637MB, low memory)
- Fine-tune with your own QaaS-specific data
- Integrate generation into the backend/frontend later

## Setup

1. Install Ollama:
   - https://ollama.com/docs/installation

2. Verify installation:
   ```powershell
   ollama version
   ```

3. Run TinyLlama locally (very small model, ~637MB RAM):
   ```powershell
   ollama run tinyllama
   ```

## Troubleshooting Memory Issues

If you get memory errors like "model requires more system memory (X GiB) than is available":

1. **Use tinyllama**: This is the smallest viable model we tested
   ```powershell
   ollama pull tinyllama
   # Then update backend/.env: OLLAMA_MODEL=tinyllama
   ```

2. **Alternative small models** (if tinyllama doesn't work):
   ```powershell
   ollama pull phi3:3.8b    # ~2.2GB RAM (may not work on low RAM systems)
   ollama pull llama3.2     # ~2.0GB RAM (may not work on low RAM systems)
   ```

3. **Update your backend config**:
   - Edit `backend/.env`
   - Change `OLLAMA_MODEL=tinyllama` (recommended)

4. **System requirements**:
   - tinyllama: ~637MB RAM ✅ (works on most systems)
   - phi3:3.8b: ~2.2GB RAM
   - llama3.2: ~2.0GB RAM
   - llama3: ~4.7GB RAM

## Current Configuration

- **Model**: tinyllama (637MB)
- **Memory usage**: Very low
- **Quality**: Good for explanations, basic code generation
- **Performance**: Fast responses

## Fine-tuning your own data

1. Place your training examples in `fine-tune-data/*.jsonl`.
2. Each line should be a JSON object with `prompt` and `completion`.
3. Example command:
   ```powershell
   ollama fine-tune tinyllama --dataset ./fine-tune-data/example_data.jsonl --name qaas-tinyllama
   ```

## Suggested integration

- Add a backend route such as `/api/ai/generate`
- Use local Ollama HTTP API or CLI to call the model
- Example prompt domain: generate Qiskit circuits, explain quantum gates, debug quantum code

## Example local API usage

If Ollama exposes a local server, you can call it from the backend:

```powershell
curl http://localhost:11434/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"tinyllama","prompt":"Generate a Qiskit circuit that creates a Bell pair."}'
```

## Notes

- This folder is intentionally lightweight and designed for future integration.
- Use `fine-tune-data/example_data.jsonl` as your starting dataset.
- If you want to keep the AI model in a separate service, add a new backend service or Docker entry later.
