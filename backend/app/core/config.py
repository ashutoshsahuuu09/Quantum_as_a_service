from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "qaas"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    quantum_service_url: str = "http://localhost:8001"
    cors_origins: list[str] = ["http://localhost:5173"]
    ollama_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "llama3"


settings = Settings()
