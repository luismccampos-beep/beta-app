import os
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:  # pragma: no cover
    from pydantic import BaseSettings
    try:
        from pydantic import SettingsConfigDict
    except ImportError:
        SettingsConfigDict = None

class Settings(BaseSettings): # pyright: ignore[reportGeneralTypeIssues]
    if SettingsConfigDict:
        model_config = SettingsConfigDict(
            env_file=".env",
            case_sensitive=False,
            env_prefix="ML_SERVICE_",
            extra="allow"  # Allow extra fields from environment
        )
    else:
        # Fallback for older pydantic versions
        class Config:
            env_file = ".env"
            case_sensitive = False
            env_prefix = "ML_SERVICE_"

    # Application settings
    APP_NAME: str = "ML Service"
    APP_VERSION: str = "1.0.0"
    ROOT_PATH: str = ""
    API_V1_STR: str = "/api/v1"
    API_VERSION: str = "v1"
    
    # Environment settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # External services
    BACKEND_URL: str | None = None
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    MAX_THREADS: int = 10
    
    # ML settings
    MODEL_DIR: str = "models"
    MODEL_PATH: str = "models/model.pkl"
    MODEL_NAME: str = "recommender"
    BATCH_SIZE: int = 32
    NUM_WORKERS: int = 4

    # TinyAya (local LLM) settings
    TINY_AYA_API_URL: str = "http://localhost:8080/v1"
    TINY_AYA_API_KEY: str | None = None

    # Gemini (cloud LLM) settings
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta"
    
    # Security settings
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS settings
    ALLOWED_ORIGINS: list[str] = ["*"]
    ALLOWED_METHODS: list[str] = ["*"]
    ALLOWED_HEADERS: list[str] = ["*"]

    # Compatibility aliases (used by app/main.py)
    @property
    def app_name(self) -> str:
        return self.APP_NAME

    @property
    def api_version(self) -> str:
        return self.API_VERSION

    @property
    def cors_origins(self) -> list[str]:
        return self.ALLOWED_ORIGINS

    @property
    def backend_url(self) -> str | None:
        return self.BACKEND_URL
    
    # Monitoring settings
    PROMETHEUS_PORT: int = 9090
    GRAFANA_ENABLED: bool = False
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Create settings instance
settings = Settings()