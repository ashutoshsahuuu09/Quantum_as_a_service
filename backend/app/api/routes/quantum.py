from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.quantum import ExecuteRequest
from app.services.quantum_client import execute_quantum_code, get_templates

router = APIRouter()


@router.post("/execute")
async def execute_code(payload: ExecuteRequest, _=Depends(get_current_user)):
    return await execute_quantum_code(payload.code, payload.shots)


@router.get("/templates")
async def templates(_=Depends(get_current_user)):
    return await get_templates()
