from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "InsightForge API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "change-me-in-production"
    TOKEN_EXPIRE_HOURS: int = 24
    
    class Config:
        case_sensitive = True

settings = Settings()
