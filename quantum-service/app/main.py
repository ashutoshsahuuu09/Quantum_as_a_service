from fastapi import FastAPI, HTTPException

from app.executor import execute_user_code
from app.schemas import ExecuteRequest, ExecuteResponse
from app.templates import TEMPLATES
from app.validator import validate_code

app = FastAPI(title="QaaS Quantum Service", version="1.0.0")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/templates")
async def templates():
    return TEMPLATES


@app.post("/execute", response_model=ExecuteResponse)
async def execute(payload: ExecuteRequest):
    try:
        validate_code(payload.code)
        result = execute_user_code(payload.code, payload.shots)
        return ExecuteResponse(**result)
    except ValueError as ex:
        raise HTTPException(status_code=400, detail=str(ex))
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Execution error: {str(ex)}")
