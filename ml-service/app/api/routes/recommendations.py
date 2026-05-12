"""
Enhanced Recommendations API Routes
Rotas de recomendações integradas com TinyAya, RAG e XAI
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from enum import Enum

from app.models.predictor import Predictor
from app.pipelines.analytics import (
    load as load_analytics,
    panorama,
    priorities,
    user_affinity,
    cross_suggestions,
)
from app.core.config import settings
from app.ml.unified_ai_service import unified_ai_service, UnifiedAIRequest
from app.models.tiny_aya_connector import TinyAyaConnector, TinyAyaMessage
from app.core.logger import logger

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"],
    responses={404: {"description": "Not found"}},
)


# ─────────────────────────── enums ───────────────────────────

class RecommendationMethod(str, Enum):
    TRADITIONAL = "traditional"
    AI = "ai"
    HYBRID = "hybrid"
    AI_TRAVEL = "ai_travel"
    AI_ENHANCED = "ai_enhanced"


class ChatResponseType(str, Enum):
    TRAVEL = "travel_recommendation"
    GENERAL = "general_chat"


# ─────────────────────────── request models ──────────────────

class RecommendationRequest(BaseModel):
    """Request para recomendação personalizada."""
    preferences: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None
    limit: int = Field(default=10, ge=1, le=50)
    include_explanation: bool = False
    use_ai: bool = True


class TravelRecommendationRequest(BaseModel):
    """Request para recomendação de viagem."""
    destination: Optional[str] = Field(None, max_length=200)
    budget: Optional[float] = Field(None, gt=0)
    duration: Optional[int] = Field(None, ge=1, le=365, description="Duração em dias")
    preferences: Optional[Dict[str, Any]] = None
    limit: int = Field(default=5, ge=1, le=20)
    include_explanation: bool = True


class ChatRecommendationRequest(BaseModel):
    """Request para recomendação via chat."""
    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[Dict[str, str]]] = Field(
        None, max_length=20, description="Últimas mensagens da conversa"
    )


# ─────────────────────────── response models ─────────────────

class RecommendationItem(BaseModel):
    """Item individual de recomendação."""
    id: str
    title: str
    score: float = 0.0
    category: str = "general"
    description: str = ""
    rank: int
    method: str
    ai_enhanced: bool = False
    ai_score: Optional[float] = None
    ai_insights: Optional[str] = None
    destination: Optional[str] = None
    budget: Optional[float] = None
    duration: Optional[int] = None
    confidence: Optional[float] = None


class SourceItem(BaseModel):
    """Fonte usada na geração de recomendação."""
    title: Optional[str] = None
    url: Optional[str] = None
    relevance: Optional[float] = None


class RecommendationResponse(BaseModel):
    """Resposta para recomendação."""
    success: bool
    user_id: int
    recommendations: List[Dict[str, Any]]
    explanation: Optional[str] = None
    sources: Optional[List[Dict[str, Any]]] = None
    confidence: Optional[float] = None
    processing_time: float
    timestamp: str
    method: RecommendationMethod


class ChatRecommendationItem(BaseModel):
    """Item de recomendação extraído do chat."""
    id: str
    text: str
    rank: int


class ChatRecommendationResponse(BaseModel):
    """Resposta para recomendação via chat."""
    success: bool
    user_id: int
    message: str
    recommendations: List[ChatRecommendationItem]
    explanation: Optional[str] = None
    sources: Optional[List[Dict[str, Any]]] = None
    confidence: Optional[float] = None
    processing_time: float
    timestamp: str
    type: ChatResponseType


class TraditionalRecommendationsResponse(BaseModel):
    """Resposta para recomendações tradicionais (legado)."""
    success: bool
    user_id: int
    recommendations: List[Dict[str, Any]]
    timestamp: str
    method: str = "traditional"


# ─────────────────────────── constants ───────────────────────

_TRAVEL_KEYWORDS: set[str] = {
    "viagem", "viajar", "destino", "hotel", "hotéis",
    "voo", "voos", "pacote", "recomende", "passagem",
    "hospedagem", "resort", "turismo", "férias",
}

_RECOMMENDATION_SIGNAL_WORDS: set[str] = {
    "recomendo", "sugiro", "deveria", "experimente",
    "visite", "considere", "opção", "alternativa",
}

_SYSTEM_PROMPT_TRAVEL = (
    "Você é um assistente de viagem especializado da AKMLEVA. "
    "Forneça recomendações úteis e personalizadas."
)

_SYSTEM_PROMPT_ENHANCER = (
    "Você é um especialista em recomendações de viagem. "
    "Analise as recomendações fornecidas e melhore-as "
    "com base no perfil do usuário."
)

_MAX_CONVERSATION_HISTORY = 5
_AI_SCORE_BONUS = 1.1
_DEFAULT_AI_CONFIDENCE = 0.8
_FALLBACK_CONFIDENCE = 0.5


# ─────────────────────────── helpers ─────────────────────────

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _utcnow_iso() -> str:
    return _utcnow().isoformat()


def _elapsed_seconds(start: datetime) -> float:
    return (_utcnow() - start).total_seconds()


_tiny_aya: TinyAyaConnector | None = None


def _get_tiny_aya() -> TinyAyaConnector:
    """Singleton para o conector TinyAya."""
    global _tiny_aya
    if _tiny_aya is None:
        _tiny_aya = TinyAyaConnector()
    return _tiny_aya


def _is_travel_query(text: str) -> bool:
    lower = text.lower()
    return any(kw in lower for kw in _TRAVEL_KEYWORDS)


async def _get_traditional_recommendations(
    user_id: int, limit: int
) -> list[dict[str, Any]]:
    """Obtém recomendações usando o motor tradicional."""
    try:
        predictor = Predictor()
        result = predictor.predict(
            model_name="recommender",
            input_data={"user_id": user_id, "limit": limit},
        )

        raw = result if isinstance(result, list) else result.get("items", [])

        return [
            {
                "id": rec.get("id", f"rec_{i}"),
                "title": rec.get("title", f"Recomendação {i + 1}"),
                "score": rec.get("score", 0.0),
                "category": rec.get("category", "general"),
                "description": rec.get("description", ""),
                "rank": i + 1,
                "method": RecommendationMethod.TRADITIONAL,
            }
            for i, rec in enumerate(raw[:limit])
        ]
    except Exception as e:
        logger.exception("Failed to get traditional recommendations")
        return []


async def _get_user_profile(user_id: int) -> dict[str, Any]:
    """Carrega o perfil de afinidades do usuário."""
    try:
        inter, items = load_analytics(
            "app/data/interactions.csv", "app/data/items.csv"
        )
        return user_affinity(inter, items, user_id)
    except Exception:
        logger.exception("Failed to load user profile", extra={"user_id": user_id})
        return {}


def _build_travel_query(request: TravelRecommendationRequest) -> str:
    """Monta a query textual a partir dos parâmetros de viagem."""
    parts = ["Recomendações de viagem personalizadas"]

    if request.destination:
        parts.append(f"para {request.destination}")
    if request.budget:
        parts.append(f"com orçamento de €{request.budget:,.2f}")
    if request.duration:
        parts.append(f"duração de {request.duration} dias")

    if request.preferences:
        travel_type = request.preferences.get("travel_type")
        if travel_type:
            parts.append(f"tipo: {travel_type}")
        activities = request.preferences.get("activities")
        if activities:
            parts.append(f"atividades: {', '.join(activities)}")

    return " ".join(parts)


async def _enhance_with_ai(
    recommendations: list[dict[str, Any]],
    user_id: int,
    preferences: dict[str, Any],
    context: dict[str, Any],
    include_explanation: bool,
) -> dict[str, Any]:
    """Enriquece recomendações tradicionais com análise da IA."""
    try:
        top_recs = recommendations[:5]
        recs_text = "\n".join(
            f"{i + 1}. {r.get('title', '')} (score: {r.get('score', 0):.2f})"
            for i, r in enumerate(top_recs)
        )

        query = (
            f"Com base no perfil do usuário {user_id} e nas recomendações abaixo:\n\n"
            f"{recs_text}\n\n"
            f"Analise e melhore estas recomendações considerando:\n"
            f"- Preferências: {preferences}\n"
            f"- Contexto: {context}\n\n"
            "Forneça uma análise detalhada das 3 melhores recomendações."
        )

        connector = _get_tiny_aya()
        messages = [
            TinyAyaMessage(role="system", content=_SYSTEM_PROMPT_ENHANCER),
            TinyAyaMessage(role="user", content=query),
        ]

        response = await connector.generate_text(messages, max_tokens=1000)

        enhanced = _parse_ai_enhanced_recommendations(response.content, top_recs)

        return {
            "recommendations": enhanced,
            "confidence": _DEFAULT_AI_CONFIDENCE,
            "explanation": response.content if include_explanation else None,
        }
    except Exception:
        logger.exception("AI enhancement failed, returning originals")
        return {
            "recommendations": recommendations,
            "confidence": _FALLBACK_CONFIDENCE,
        }


def _parse_ai_enhanced_recommendations(
    ai_text: str, originals: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Mescla insights da IA com as recomendações originais."""
    insight_preview = ai_text[:200].replace("\n", " ")

    return [
        {
            **rec,
            "ai_enhanced": True,
            "ai_score": rec.get("score", 0.0) * _AI_SCORE_BONUS,
            "method": RecommendationMethod.AI_ENHANCED,
            "ai_insights": f"Analisado por IA: {insight_preview}…",
        }
        for rec in originals
    ]


def _format_travel_recommendations(
    ai_response, request: TravelRecommendationRequest
) -> list[dict[str, Any]]:
    """Formata a resposta da IA em itens de recomendação de viagem."""
    lines = [
        line.strip()
        for line in ai_response.answer.split("\n")
        if line.strip()
    ]

    return [
        {
            "id": f"travel_rec_{i + 1}",
            "title": f"Recomendação {i + 1}",
            "description": line,
            "destination": request.destination,
            "budget": request.budget,
            "duration": request.duration,
            "confidence": ai_response.confidence,
            "method": RecommendationMethod.AI_TRAVEL,
            "rank": i + 1,
        }
        for i, line in enumerate(lines[: request.limit])
    ]


def _extract_recommendations_from_text(text: str) -> list[ChatRecommendationItem]:
    """Extrai itens de recomendação do texto livre."""
    results: list[ChatRecommendationItem] = []
    rank = 0

    for line in text.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue
        if any(kw in stripped.lower() for kw in _RECOMMENDATION_SIGNAL_WORDS):
            rank += 1
            results.append(
                ChatRecommendationItem(
                    id=f"chat_rec_{rank}",
                    text=stripped,
                    rank=rank,
                )
            )
            if rank >= 5:
                break

    return results


# ─────────────────────────── routes ──────────────────────────

@router.post(
    "/{user_id}",
    response_model=RecommendationResponse,
    summary="Recomendações personalizadas",
)
async def get_enhanced_recommendations(
    user_id: int,
    request: RecommendationRequest,
):
    """
    Gera recomendações personalizadas combinando o motor tradicional
    com enriquecimento por IA (TinyAya + XAI).

    Quando `use_ai=False`, retorna apenas recomendações tradicionais.
    """
    start = _utcnow()

    try:
        traditional = await _get_traditional_recommendations(user_id, request.limit)

        if request.use_ai and traditional:
            enhanced = await _enhance_with_ai(
                recommendations=traditional,
                user_id=user_id,
                preferences=request.preferences or {},
                context=request.context or {},
                include_explanation=request.include_explanation,
            )

            return RecommendationResponse(
                success=True,
                user_id=user_id,
                recommendations=enhanced["recommendations"],
                explanation=enhanced.get("explanation"),
                sources=enhanced.get("sources"),
                confidence=enhanced.get("confidence"),
                processing_time=_elapsed_seconds(start),
                timestamp=_utcnow_iso(),
                method=RecommendationMethod.AI,
            )

        return RecommendationResponse(
            success=True,
            user_id=user_id,
            recommendations=traditional,
            processing_time=_elapsed_seconds(start),
            timestamp=_utcnow_iso(),
            method=RecommendationMethod.TRADITIONAL,
        )
    except Exception as e:
        logger.exception("Enhanced recommendations failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar recomendações: {e}",
        )


@router.post(
    "/{user_id}/travel",
    response_model=RecommendationResponse,
    summary="Recomendações de viagem",
)
async def get_travel_recommendations(
    user_id: int,
    request: TravelRecommendationRequest,
):
    """
    Gera recomendações de viagem usando o serviço unificado de IA,
    combinando RAG, TinyAya e XAI para respostas contextualizadas.
    """
    start = _utcnow()

    try:
        query = _build_travel_query(request)
        user_profile = await _get_user_profile(user_id)

        unified_request = UnifiedAIRequest(
            query=query,
            context={
                "user_id": user_id,
                "user_profile": user_profile,
                "destination": request.destination,
                "budget": request.budget,
                "duration": request.duration,
                **(request.preferences or {}),
            },
            user_preferences=request.preferences or {},
            include_explanation=request.include_explanation,
            include_alternatives=True,
            max_sources=8,
            language="pt",
        )

        ai_response = await unified_ai_service.process_request(unified_request)
        recommendations = _format_travel_recommendations(ai_response, request)

        explanation = None
        if ai_response.explanation and hasattr(ai_response.explanation, "explanation"):
            explanation = ai_response.explanation.explanation.get("why")

        return RecommendationResponse(
            success=True,
            user_id=user_id,
            recommendations=recommendations,
            explanation=explanation,
            sources=[s.dict() for s in ai_response.sources],
            confidence=ai_response.confidence,
            processing_time=_elapsed_seconds(start),
            timestamp=_utcnow_iso(),
            method=RecommendationMethod.AI_TRAVEL,
        )
    except Exception as e:
        logger.exception("Travel recommendations failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar recomendações de viagem: {e}",
        )


@router.post(
    "/{user_id}/chat",
    response_model=ChatRecommendationResponse,
    summary="Chat de recomendações",
)
async def chat_recommendations(
    user_id: int,
    request: ChatRecommendationRequest,
):
    """
    Interface conversacional para recomendações.

    Detecta automaticamente se a pergunta é sobre viagem (usa RAG + IA)
    ou conversa geral (usa TinyAya diretamente).
    """
    start = _utcnow()

    try:
        user_profile = await _get_user_profile(user_id)

        enhanced_context: dict[str, Any] = {
            "user_id": user_id,
            "user_profile": user_profile,
            **(request.context or {}),
        }

        if request.conversation_history:
            enhanced_context["conversation_history"] = (
                request.conversation_history[-_MAX_CONVERSATION_HISTORY:]
            )

        if _is_travel_query(request.message):
            return await _handle_travel_chat(
                user_id, request, enhanced_context, start
            )

        return await _handle_general_chat(
            user_id, request, user_profile, start
        )
    except Exception as e:
        logger.exception("Chat recommendations failed")
        raise HTTPException(status_code=500, detail=f"Erro no chat: {e}")


@router.get(
    "/{user_id}/traditional",
    response_model=TraditionalRecommendationsResponse,
    summary="Recomendações tradicionais (legado)",
    deprecated=True,
)
async def get_traditional_recommendations_legacy(
    user_id: int,
    limit: int = Query(default=10, ge=1, le=50),
):
    """
    Endpoint legado mantido para compatibilidade.

    Prefira `POST /{user_id}` com `use_ai=False`.
    """
    try:
        recommendations = await _get_traditional_recommendations(user_id, limit)

        return TraditionalRecommendationsResponse(
            success=True,
            user_id=user_id,
            recommendations=recommendations,
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("Legacy recommendations failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter recomendações: {e}",
        )


# ─────────────────────── chat sub-handlers ───────────────────

async def _handle_travel_chat(
    user_id: int,
    request: ChatRecommendationRequest,
    context: dict[str, Any],
    start: datetime,
) -> ChatRecommendationResponse:
    """Processa perguntas de viagem via serviço unificado."""
    unified_request = UnifiedAIRequest(
        query=request.message,
        context=context,
        include_explanation=True,
        include_alternatives=True,
        language="pt",
    )

    ai_response = await unified_ai_service.process_request(unified_request)

    explanation = None
    if ai_response.explanation and hasattr(ai_response.explanation, "explanation"):
        explanation = ai_response.explanation.explanation.get("why")

    return ChatRecommendationResponse(
        success=True,
        user_id=user_id,
        message=ai_response.answer,
        recommendations=_extract_recommendations_from_text(ai_response.answer),
        explanation=explanation,
        sources=[s.dict() for s in ai_response.sources],
        confidence=ai_response.confidence,
        processing_time=_elapsed_seconds(start),
        timestamp=_utcnow_iso(),
        type=ChatResponseType.TRAVEL,
    )


async def _handle_general_chat(
    user_id: int,
    request: ChatRecommendationRequest,
    user_profile: dict[str, Any],
    start: datetime,
) -> ChatRecommendationResponse:
    """Processa conversa geral via TinyAya."""
    connector = _get_tiny_aya()

    messages = [
        TinyAyaMessage(role="system", content=_SYSTEM_PROMPT_TRAVEL),
        TinyAyaMessage(
            role="user",
            content=f"Perfil do usuário: {user_profile}\n\nPergunta: {request.message}",
        ),
    ]

    response = await connector.generate_text(messages)

    return ChatRecommendationResponse(
        success=True,
        user_id=user_id,
        message=response.content,
        recommendations=_extract_recommendations_from_text(response.content),
        processing_time=_elapsed_seconds(start),
        timestamp=_utcnow_iso(),
        type=ChatResponseType.GENERAL,
    )