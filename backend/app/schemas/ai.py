from pydantic import BaseModel, Field


class AiRequest(BaseModel):
    prompt: str = Field(min_length=1)
    max_tokens: int = Field(default=256, ge=1, le=2048)
    model: str | None = None


class AiResponse(BaseModel):
    text: str
    raw: dict | None = None
