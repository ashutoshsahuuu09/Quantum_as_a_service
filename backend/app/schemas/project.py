from datetime import datetime
from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    description: str = Field(default="", max_length=500)
    code: str = ""


class ProjectUpdate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    description: str = Field(default="", max_length=500)
    code: str = ""


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str
    code: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
