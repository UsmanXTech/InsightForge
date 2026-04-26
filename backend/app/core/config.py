from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "InsightForge API"
    API_V1_STR: str = "/api"
    
    class Config:
        case_sensitive = True

settings = Settings()
