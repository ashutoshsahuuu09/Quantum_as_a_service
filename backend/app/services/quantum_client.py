import httpx
from fastapi import HTTPException

from app.core.config import settings


async def execute_quantum_code(code: str, shots: int):
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                f"{settings.quantum_service_url}/execute", json={"code": code, "shots": shots}
            )
        if resp.status_code >= 400:
            try:
                detail = resp.json().get("detail", "Quantum execution failed")
            except:
                detail = resp.text or "Quantum execution failed"
            raise HTTPException(status_code=resp.status_code, detail=detail)
        return resp.json()
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Quantum service unavailable: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backend error: {str(e)}")


async def get_templates():
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{settings.quantum_service_url}/templates")
    resp.raise_for_status()
    return resp.json()
