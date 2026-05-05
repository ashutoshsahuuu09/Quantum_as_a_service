from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, projects, quantum, ai
from app.core.config import settings

app = FastAPI(title="QaaS Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(quantum.router, prefix="/api/quantum", tags=["quantum"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])


@app.get("/health")
async def health():
    return {"status": "ok"}
