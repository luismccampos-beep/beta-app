import logging

from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logger import setup_logging
from app.api.routes import router as api_router

try:
    from app.ml.ranking_engine import TravelRankingEngine
except ModuleNotFoundError:
    class TravelRankingEngine:
        def __init__(self):
            pass

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    description="API de ranking personalizado para recomendações de viagem",
    version=settings.api_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=f"/{settings.api_version}")


@app.get("/health")
async def health() -> JSONResponse:
    return JSONResponse(
        status_code=200,
        content={
            "status": "ok",
            "time": datetime.utcnow().isoformat(),
            "version": settings.APP_VERSION,
        },
    )

ranking_engine = TravelRankingEngine()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.app_name,
        version=settings.api_version,
        description="API para ranking personalizado de recomendações de viagem",
        routes=app.routes,
    )

    openapi_schema["info"]["x-logo"] = {
        "url": "https://example.com/logo.png",
        "backgroundColor": "#FFFFFF"
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi