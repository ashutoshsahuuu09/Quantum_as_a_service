from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.ai import AiRequest, AiResponse
from app.services.ai_client import generate_ai_response

router = APIRouter()


@router.post("/generate", response_model=AiResponse)
async def generate_ai(payload: AiRequest):
    return await generate_ai_response(payload.prompt, payload.max_tokens, payload.model)
