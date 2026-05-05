from pydantic import BaseModel, Field


class ExecuteRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)
    shots: int = Field(default=1024, ge=1, le=8192)


class ExecuteResponse(BaseModel):
    counts: dict[str, int] | None = None
    statevector: list[float] | None = None
    circuit_text: str | None = None
    stdout: str = ""
