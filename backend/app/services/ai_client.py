import httpx
from fastapi import HTTPException

from app.core.config import settings


async def generate_ai_response(prompt: str, max_tokens: int = 256, model: str | None = None) -> dict:
    payload = {
        "model": model or settings.ollama_model,
        "prompt": prompt,
        "stream": False,
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(f"{settings.ollama_url}/api/generate", json=payload)
        if resp.status_code >= 400:
            detail = resp.json().get("error") or resp.text
            raise HTTPException(status_code=400, detail=f"AI generation failed: {detail}")

        data = resp.json()
        text = data.get("response", "")
        return {"text": text, "raw": data}
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="AI service unavailable")
