"""
Unified AI API Routes
Rotas da API para o serviço unificado de IA (RAG + XAI + TinyAya)
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from enum import Enum

from app.ml.unified_ai_service import (
    unified_ai_service,
    UnifiedAIRequest,
    UnifiedAIResponse,
)
from app.core.logger import logger

router = APIRouter(prefix="/unified", tags=["Unified AI"])


# ─────────────────────────── enums ───────────────────────────

class QueryType(str, Enum):
    GENERAL = "general"
    TRAVEL_INFO = "travel_info"
    TRAVEL_RECOMMENDATION = "travel_recommendation"
    DESTINATION_COMPARISON = "destination_comparison"


class SuggestedApproach(str, Enum):
    UNIFIED = "unified_query"
    TRAVEL = "travel_recommendation"
    COMPARE = "compare_destinations"


class Complexity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# ─────────────────────────── request models ──────────────────

class TravelRecommendationRequest(BaseModel):
    """Request para recomendação de viagem."""
    destination: str = Field(..., min_length=1, max_length=200)
    preferences: Dict[str, Any] = Field(default_factory=dict)
    budget: Optional[float] = Field(None, gt=0, description="Orçamento em euros")
    duration: Optional[int] = Field(None, ge=1, le=365, description="Dias de viagem")
    language: str = Field(default="pt", pattern=r"^(pt|en|es|fr)$")


class DestinationComparisonRequest(BaseModel):
    """Request para comparação de destinos."""
    destinations: List[str] = Field(
        ..., min_length=2, max_length=10,
        description="Destinos a comparar (mínimo 2)",
    )
    preferences: Dict[str, Any] = Field(default_factory=dict)
    criteria: Optional[List[str]] = Field(
        None, max_length=20,
        description="Critérios específicos de comparação",
    )


class ChatRequest(BaseModel):
    """Request para chat conversacional."""
    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[Dict[str, str]]] = Field(
        None, max_length=20,
    )


class AnalyzeQueryRequest(BaseModel):
    """Request para análise de query."""
    query: str = Field(..., min_length=1, max_length=2000)


# ─────────────────────────── response models ─────────────────

class UnifiedQueryResponse(BaseModel):
    """Resposta para consultas unificadas."""
    success: bool
    data: Optional[UnifiedAIResponse] = None
    error: Optional[str] = None
    processing_time: float = 0.0


class TravelRecommendationResponse(BaseModel):
    """Resposta para recomendação de viagem."""
    success: bool
    recommendation: Dict[str, Any]
    destination: str
    processing_time: float


class DestinationComparisonResponse(BaseModel):
    """Resposta para comparação de destinos."""
    success: bool
    comparison: Dict[str, Any]
    destinations_compared: int


class SourceDetail(BaseModel):
    """Fonte individual usada na resposta."""
    title: Optional[str] = None
    url: Optional[str] = None
    relevance: Optional[float] = None


class ChatResponse(BaseModel):
    """Resposta para chat conversacional."""
    success: bool
    message: str
    sources: List[Dict[str, Any]] = []
    explanation: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None
    request_id: Optional[str] = None
    processing_time: float


class CapabilityDetail(BaseModel):
    """Detalhe de uma capacidade do serviço."""
    name: str
    description: str
    features: List[str]


class CapabilitiesResponse(BaseModel):
    """Resposta para listagem de capacidades."""
    capabilities: List[CapabilityDetail]
    integrations: Dict[str, str]
    languages: List[str]
    supported_queries: List[str]


class HealthResponse(BaseModel):
    """Resposta para health check."""
    status: str
    services: Dict[str, Any] = {}
    capabilities: List[str] = []
    integration_status: Dict[str, Any] = {}
    timestamp: str
    error: Optional[str] = None


class QueryAnalysisDetail(BaseModel):
    """Resultado detalhado da análise de query."""
    query: str
    query_type: QueryType
    suggested_approach: SuggestedApproach
    estimated_complexity: Complexity
    recommended_max_sources: int
    detected_keywords: List[str] = []


class QueryAnalysisResponse(BaseModel):
    """Resposta para análise de query."""
    success: bool
    analysis: QueryAnalysisDetail


# ─────────────────────────── constants ───────────────────────

_TRAVEL_KEYWORDS: set[str] = {
    "viagem", "viajar", "destino", "hotel", "hotéis",
    "voo", "voos", "pacote", "rota", "hospedagem",
    "passagem", "resort", "turismo", "férias",
}

_COMPARISON_KEYWORDS: set[str] = {
    "comparar", "compare", "diferença", "melhor",
    "versus", "vs", "ou", "entre",
}

_RECOMMENDATION_KEYWORDS: set[str] = {
    "recomende", "sugira", "qual", "onde",
    "dica", "sugestão", "indique",
}

_MAX_CONVERSATION_HISTORY = 5

_CAPABILITIES: list[CapabilityDetail] = [
    CapabilityDetail(
        name="unified_ai_processing",
        description="Processamento unificado de IA com RAG e XAI",
        features=["contextual_answers", "explanations", "alternatives"],
    ),
    CapabilityDetail(
        name="travel_recommendations",
        description="Recomendações personalizadas de viagem",
        features=["destination_analysis", "budget_optimization", "duration_planning"],
    ),
    CapabilityDetail(
        name="destination_comparison",
        description="Comparação detalhada entre destinos",
        features=["multi_destination_analysis", "criteria_comparison", "ranking"],
    ),
    CapabilityDetail(
        name="conversational_ai",
        description="Interface conversacional com contexto",
        features=["chat_history", "context_awareness", "multi_language"],
    ),
]

_INTEGRATIONS: Dict[str, str] = {
    "rag": "Retrieval-Augmented Generation",
    "xai": "Explainable AI",
    "tiny_aya": "Local LLM",
    "vector_search": "Similaridade semântica",
    "factual_verification": "Verificação factual",
}

_SUPPORTED_LANGUAGES: list[str] = ["pt", "en", "es", "fr"]

_SUPPORTED_QUERY_TYPES: list[str] = [
    "travel_recommendations",
    "destination_info",
    "comparisons",
    "general_questions",
]

_COMPLEXITY_THRESHOLDS = {"low": 8, "high": 40}  # word counts

_SOURCE_COUNTS: Dict[str, int] = {
    Complexity.LOW: 3,
    Complexity.MEDIUM: 5,
    Complexity.HIGH: 8,
}


# ─────────────────────────── helpers ─────────────────────────

def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _find_matches(text: str, keywords: set[str]) -> list[str]:
    """Retorna as keywords encontradas no texto."""
    lower = text.lower()
    return [kw for kw in keywords if kw in lower]


def _classify_query(query: str) -> QueryAnalysisDetail:
    """Classifica uma query quanto a tipo, abordagem e complexidade."""
    travel_hits = _find_matches(query, _TRAVEL_KEYWORDS)
    comparison_hits = _find_matches(query, _COMPARISON_KEYWORDS)
    recommendation_hits = _find_matches(query, _RECOMMENDATION_KEYWORDS)

    all_hits = travel_hits + comparison_hits + recommendation_hits

    # Determine query type
    if travel_hits:
        if comparison_hits:
            qtype = QueryType.DESTINATION_COMPARISON
            approach = SuggestedApproach.COMPARE
        elif recommendation_hits:
            qtype = QueryType.TRAVEL_RECOMMENDATION
            approach = SuggestedApproach.TRAVEL
        else:
            qtype = QueryType.TRAVEL_INFO
            approach = SuggestedApproach.UNIFIED
    else:
        qtype = QueryType.GENERAL
        approach = SuggestedApproach.UNIFIED

    # Determine complexity by word count
    word_count = len(query.split())
    if word_count >= _COMPLEXITY_THRESHOLDS["high"]:
        complexity = Complexity.HIGH
    elif word_count <= _COMPLEXITY_THRESHOLDS["low"]:
        complexity = Complexity.LOW
    else:
        complexity = Complexity.MEDIUM

    return QueryAnalysisDetail(
        query=query,
        query_type=qtype,
        suggested_approach=approach,
        estimated_complexity=complexity,
        recommended_max_sources=_SOURCE_COUNTS[complexity],
        detected_keywords=all_hits,
    )


def _is_travel_question(text: str) -> bool:
    return bool(_find_matches(text, _TRAVEL_KEYWORDS))


# ─────────────────────────── routes ──────────────────────────

@router.post(
    "/query",
    response_model=UnifiedQueryResponse,
    summary="Consulta unificada",
)
async def unified_query(request: UnifiedAIRequest):
    """
    Processa uma consulta combinando **RAG**, **XAI** e **TinyAya**.

    Retorna resposta contextualizada com fontes, explicação opcional
    e alternativas.
    """
    try:
        logger.info(
            "Unified query received",
            extra={"preview": request.query[:100]},
        )

        response = await unified_ai_service.process_request(request)

        return UnifiedQueryResponse(
            success=True,
            data=response,
            processing_time=response.processing_time,
        )
    except Exception as e:
        logger.exception("Unified query failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar consulta unificada: {e}",
        )


@router.post(
    "/travel-recommendation",
    response_model=TravelRecommendationResponse,
    summary="Recomendação de viagem",
)
async def travel_recommendation(body: TravelRecommendationRequest):
    """
    Gera uma recomendação completa de viagem para o destino informado,
    considerando orçamento, duração e preferências pessoais.
    """
    try:
        logger.info(
            "Travel recommendation requested",
            extra={"destination": body.destination},
        )

        response = await unified_ai_service.get_travel_recommendation(
            destination=body.destination,
            preferences=body.preferences,
            budget=body.budget,
            duration=body.duration,
        )

        return TravelRecommendationResponse(
            success=True,
            recommendation=response.dict(),
            destination=body.destination,
            processing_time=response.processing_time,
        )
    except Exception as e:
        logger.exception("Travel recommendation failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar recomendação de viagem: {e}",
        )


@router.post(
    "/compare-destinations",
    response_model=DestinationComparisonResponse,
    summary="Comparar destinos",
)
async def compare_destinations(body: DestinationComparisonRequest):
    """
    Compara múltiplos destinos de viagem com base nas preferências
    e critérios fornecidos, gerando um ranking explicado.
    """
    try:
        logger.info(
            "Destination comparison requested",
            extra={"destinations": body.destinations},
        )

        comparison = await unified_ai_service.compare_destinations(
            destinations=body.destinations,
            preferences=body.preferences,
            criteria=body.criteria,
        )

        return DestinationComparisonResponse(
            success=True,
            comparison=comparison,
            destinations_compared=len(body.destinations),
        )
    except Exception as e:
        logger.exception("Destination comparison failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao comparar destinos: {e}",
        )


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Chat com IA unificada",
)
async def chat_with_ai(body: ChatRequest):
    """
    Interface conversacional com a IA unificada.

    Detecta automaticamente se a pergunta envolve viagem (ativa RAG + XAI)
    ou é uma conversa geral (modo simplificado).
    """
    try:
        chat_context: Dict[str, Any] = body.context or {}

        if body.conversation_history:
            chat_context["conversation_history"] = (
                body.conversation_history[-_MAX_CONVERSATION_HISTORY:]
            )

        is_travel = _is_travel_question(body.message)

        request = UnifiedAIRequest(
            query=body.message,
            context=chat_context,
            include_explanation=is_travel,
            include_alternatives=is_travel,
            language="pt",
        )

        response = await unified_ai_service.process_request(request)

        return ChatResponse(
            success=True,
            message=response.answer,
            sources=[s.dict() for s in response.sources],
            explanation=response.explanation.dict() if response.explanation else None,
            confidence=response.confidence,
            request_id=response.request_id,
            processing_time=response.processing_time,
        )
    except Exception as e:
        logger.exception("Unified chat failed")
        raise HTTPException(status_code=500, detail=f"Erro no chat: {e}")


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
)
async def health_check():
    """Verifica a saúde do serviço unificado e de suas integrações."""
    try:
        health = await unified_ai_service.health_check()

        return HealthResponse(
            status=health["status"],
            services=health.get("services", {}),
            capabilities=health.get("capabilities", []),
            integration_status=health.get("integration_status", {}),
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("Unified health check failed")
        return HealthResponse(
            status="unhealthy",
            error=str(e),
            timestamp=_utcnow_iso(),
        )


@router.get(
    "/capabilities",
    response_model=CapabilitiesResponse,
    summary="Capacidades do serviço",
)
async def get_capabilities():
    """
    Lista todas as capacidades, integrações e idiomas suportados
    pelo serviço unificado de IA.
    """
    return CapabilitiesResponse(
        capabilities=_CAPABILITIES,
        integrations=_INTEGRATIONS,
        languages=_SUPPORTED_LANGUAGES,
        supported_queries=_SUPPORTED_QUERY_TYPES,
    )


@router.post(
    "/analyze-query",
    response_model=QueryAnalysisResponse,
    summary="Analisar query",
)
async def analyze_query(body: AnalyzeQueryRequest):
    """
    Analisa uma query para determinar o tipo, a complexidade estimada
    e a abordagem de processamento mais adequada.

    Útil para pré-roteamento de requisições no front-end.
    """
    try:
        analysis = _classify_query(body.query)

        return QueryAnalysisResponse(
            success=True,
            analysis=analysis,
        )
    except Exception as e:
        logger.exception("Query analysis failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao analisar query: {e}",
        )