import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./health_guardian.db"
    secret_key: str = "your-secret-key-here"
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()