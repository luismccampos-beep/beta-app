"""
Chat API Routes
Rotas da API para serviço de chat com TinyAya, RAG e XAI
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from enum import Enum
import logging

from app.ml.chat_service import (
    chat_service,
    ChatRequest,
    ChatResponse,
    ChatSession,
)
from app.core.logger import logger

router = APIRouter(prefix="/chat", tags=["chat"])


# ─────────────────────────── enums ───────────────────────────

class SuggestionContext(str, Enum):
    GENERAL = "general"
    HOTEL = "hotel"
    FLIGHT = "flight"
    DESTINATION = "destination"
    ACTIVITY = "activity"


# ─────────────────────────── request models ──────────────────

class AnalyzeMessageRequest(BaseModel):
    """Corpo da requisição para análise de mensagem."""
    message: str = Field(..., min_length=1, max_length=2000)


class FeedbackRequest(BaseModel):
    """Corpo da requisição para feedback do chat."""
    session_id: str = Field(..., min_length=1)
    message_id: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5, description="Avaliação de 1 a 5")
    comment: Optional[str] = Field(None, max_length=1000)
    helpful: Optional[bool] = None
    accurate: Optional[bool] = None


class CleanupRequest(BaseModel):
    """Corpo da requisição para limpeza de sessões."""
    max_age_hours: int = Field(default=24, ge=1, le=168)


# ─────────────────────────── response models ─────────────────

class MessageDetail(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    metadata: Dict[str, Any] = {}


class SessionInfo(BaseModel):
    user_id: int
    created_at: str
    last_activity: str
    message_count: int
    preferences: Dict[str, Any] = {}
    context: Dict[str, Any] = {}


class SessionSummary(BaseModel):
    id: str
    created_at: str
    last_activity: str
    message_count: int
    preferences: Dict[str, Any] = {}


class ChatHistoryResponse(BaseModel):
    success: bool
    session_id: str
    messages: List[MessageDetail]
    session_info: SessionInfo


class UserSessionsResponse(BaseModel):
    success: bool
    user_id: int
    sessions: List[SessionSummary]
    total_sessions: int


class ChatStatsResponse(BaseModel):
    success: bool
    stats: Dict[str, Any]


class DeleteSessionResponse(BaseModel):
    success: bool
    message: str
    session_id: str


class CleanupResponse(BaseModel):
    success: bool
    deleted_sessions: int
    max_age_hours: int
    message: str


class HealthResponse(BaseModel):
    status: str
    services: Dict[str, Any] = {}
    sessions: Dict[str, Any] = {}
    capabilities: List[str] = []
    timestamp: str
    error: Optional[str] = None


class IntentAnalysis(BaseModel):
    message: str
    is_travel_related: bool
    intents: List[str]
    suggested_approach: str
    suggested_services: List[str]
    estimated_complexity: str


class AnalyzeResponse(BaseModel):
    success: bool
    analysis: IntentAnalysis


class SuggestionsResponse(BaseModel):
    success: bool
    user_id: int
    context: Optional[str]
    suggestions: List[str]
    total_suggestions: int
    recent_sessions: int


class FeedbackResponse(BaseModel):
    success: bool
    message: str
    feedback_id: str
    timestamp: str


# ─────────────────────────── helpers ─────────────────────────

def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _build_session_summary(session: ChatSession) -> SessionSummary:
    return SessionSummary(
        id=session.id,
        created_at=session.created_at.isoformat(),
        last_activity=session.last_activity.isoformat(),
        message_count=len(session.messages),
        preferences=session.preferences,
    )


_INTENT_KEYWORDS: Dict[str, List[str]] = {
    "recommendation": ["recomende", "sugira", "qual", "onde", "melhor"],
    "help_request":   ["ajuda", "como", "preciso", "explique"],
    "price_inquiry":  ["quanto", "custo", "preço", "barato", "caro", "orçamento"],
    "timing_inquiry": ["quando", "melhor época", "época", "mês", "temporada"],
    "booking":        ["reservar", "reserva", "agendar", "comprar"],
}

_CONTEXTUAL_SUGGESTIONS: Dict[str, List[str]] = {
    "lisboa": [
        "O que fazer em Lisboa em 3 dias?",
        "Quais os melhores bairros para se hospedar em Lisboa?",
        "Como usar transporte público em Lisboa?",
        "Onde comer bem em Lisboa sem gastar muito?",
        "Quais as atrações imperdíveis em Lisboa?",
    ],
    "hotel": [
        "Como encontrar hotéis baratos e de qualidade?",
        "Qual a melhor época para reservar hotéis?",
        "Hotéis com café da manhã incluído?",
        "Hotéis recomendados por viajantes?",
        "Como cancelar reservas de hotel sem custos?",
    ],
    "voo": [
        "Quando comprar passagens aéreas mais baratas?",
        "Como evitar taxas extras em voos?",
        "Melhores companhias aéreas para Portugal?",
        "Como fazer check-in online?",
        "O que fazer em caso de voo cancelado?",
    ],
}

_DEFAULT_SUGGESTIONS: List[str] = [
    "Planeje sua viagem dos sonhos com nossa ajuda",
    "Descubra os melhores destinos para suas preferências",
    "Encontre hotéis com excelente custo-benefício",
    "Receba recomendações personalizadas de atividades",
    "Compare diferentes opções de viagem facilmente",
]


def _detect_intents(text: str) -> List[str]:
    lower = text.lower()
    return [
        intent
        for intent, keywords in _INTENT_KEYWORDS.items()
        if any(kw in lower for kw in keywords)
    ]


def _pick_suggestions(context: Optional[str]) -> List[str]:
    if context:
        ctx = context.lower()
        for key, suggestions in _CONTEXTUAL_SUGGESTIONS.items():
            if key in ctx:
                return suggestions
    return list(_DEFAULT_SUGGESTIONS)


# ─────────────────────────── routes ──────────────────────────

@router.post("/", response_model=ChatResponse, summary="Enviar mensagem")
async def send_message(request: ChatRequest):
    """
    Envia mensagem para o assistente de chat.

    Combina **TinyAya**, **RAG** e **XAI** para gerar respostas
    contextuais sobre viagens ou conversas gerais.
    """
    try:
        logger.info(
            "Chat request",
            extra={"user_id": request.user_id, "preview": request.message[:80]},
        )
        return await chat_service.process_message(request)
    except Exception as e:
        logger.exception("Failed to process chat message")
        raise HTTPException(status_code=500, detail=f"Erro ao processar mensagem: {e}")


@router.get(
    "/session/{session_id}",
    response_model=ChatHistoryResponse,
    summary="Histórico da sessão",
)
async def get_session_history(session_id: str):
    """Retorna o histórico completo de mensagens de uma sessão."""
    session = await chat_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")

    return ChatHistoryResponse(
        success=True,
        session_id=session_id,
        messages=[
            MessageDetail(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                timestamp=msg.timestamp.isoformat(),
                metadata=msg.metadata,
            )
            for msg in session.messages
        ],
        session_info=SessionInfo(
            user_id=session.user_id,
            created_at=session.created_at.isoformat(),
            last_activity=session.last_activity.isoformat(),
            message_count=len(session.messages),
            preferences=session.preferences,
            context=session.context,
        ),
    )


@router.get(
    "/user/{user_id}/sessions",
    response_model=UserSessionsResponse,
    summary="Sessões do usuário",
)
async def get_user_sessions(
    user_id: int,
    limit: int = Query(default=10, ge=1, le=50, description="Máximo de sessões"),
    offset: int = Query(default=0, ge=0, description="Deslocamento para paginação"),
):
    """Lista as sessões de chat de um usuário, ordenadas pela atividade mais recente."""
    try:
        sessions = await chat_service.get_user_sessions(user_id)
        sessions.sort(key=lambda s: s.last_activity, reverse=True)

        page = sessions[offset : offset + limit]

        return UserSessionsResponse(
            success=True,
            user_id=user_id,
            sessions=[_build_session_summary(s) for s in page],
            total_sessions=len(sessions),
        )
    except Exception as e:
        logger.exception("Failed to fetch user sessions")
        raise HTTPException(status_code=500, detail=f"Erro ao obter sessões: {e}")


@router.delete(
    "/session/{session_id}",
    response_model=DeleteSessionResponse,
    summary="Deletar sessão",
)
async def delete_session(session_id: str):
    """Remove permanentemente uma sessão de chat."""
    success = await chat_service.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")

    return DeleteSessionResponse(
        success=True,
        message="Sessão deletada com sucesso",
        session_id=session_id,
    )


@router.post(
    "/cleanup",
    response_model=CleanupResponse,
    summary="Limpar sessões antigas",
)
async def cleanup_old_sessions(body: CleanupRequest):
    """Remove sessões mais antigas que *max_age_hours* horas."""
    try:
        deleted_count = await chat_service.clear_old_sessions(body.max_age_hours)
        return CleanupResponse(
            success=True,
            deleted_sessions=deleted_count,
            max_age_hours=body.max_age_hours,
            message=f"Limpeza concluída: {deleted_count} sessões removidas",
        )
    except Exception as e:
        logger.exception("Cleanup failed")
        raise HTTPException(status_code=500, detail=f"Erro na limpeza: {e}")


@router.get("/stats", response_model=ChatStatsResponse, summary="Estatísticas")
async def get_chat_stats():
    """Retorna métricas agregadas do serviço de chat."""
    try:
        stats = await chat_service.get_chat_stats()
        return ChatStatsResponse(success=True, stats=stats)
    except Exception as e:
        logger.exception("Failed to fetch chat stats")
        raise HTTPException(status_code=500, detail=f"Erro ao obter estatísticas: {e}")


@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check():
    """Verifica a saúde do serviço de chat e de suas dependências."""
    try:
        health = await chat_service.health_check()
        return HealthResponse(
            status=health["status"],
            services=health.get("services", {}),
            sessions=health.get("sessions", {}),
            capabilities=health.get("capabilities", []),
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("Health check failed")
        return HealthResponse(
            status="unhealthy",
            error=str(e),
            timestamp=_utcnow_iso(),
        )


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analisar mensagem",
)
async def analyze_message(body: AnalyzeMessageRequest):
    """
    Analisa uma mensagem para detectar intenções e sugerir a melhor
    abordagem de processamento (RAG, chat geral, etc.).
    """
    try:
        is_travel = chat_service._is_travel_related(body.message)
        intents = _detect_intents(body.message)

        if is_travel:
            approach = "travel_rag"
            services = ["RAG", "TinyAya", "XAI"]
        else:
            approach = "general_chat"
            services = ["TinyAya"]

        word_count = len(body.message.split())
        complexity = "high" if word_count > 50 else ("medium" if word_count > 15 else "low")

        return AnalyzeResponse(
            success=True,
            analysis=IntentAnalysis(
                message=body.message,
                is_travel_related=is_travel,
                intents=intents,
                suggested_approach=approach,
                suggested_services=services,
                estimated_complexity=complexity,
            ),
        )
    except Exception as e:
        logger.exception("Message analysis failed")
        raise HTTPException(status_code=500, detail=f"Erro ao analisar mensagem: {e}")


@router.get(
    "/suggestions/{user_id}",
    response_model=SuggestionsResponse,
    summary="Sugestões contextuais",
)
async def get_context_suggestions(
    user_id: int,
    context: Optional[str] = Query(default=None, max_length=200),
    limit: int = Query(default=5, ge=1, le=10),
):
    """Gera sugestões de perguntas personalizadas para o usuário."""
    try:
        user_sessions = await chat_service.get_user_sessions(user_id)
        suggestions = _pick_suggestions(context)[:limit]

        return SuggestionsResponse(
            success=True,
            user_id=user_id,
            context=context,
            suggestions=suggestions,
            total_suggestions=len(suggestions),
            recent_sessions=len(user_sessions),
        )
    except Exception as e:
        logger.exception("Failed to generate suggestions")
        raise HTTPException(status_code=500, detail=f"Erro ao gerar sugestões: {e}")


@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    summary="Enviar feedback",
)
async def submit_chat_feedback(body: FeedbackRequest):
    """
    Registra o feedback do usuário sobre uma resposta específica do chat.

    O *rating* deve ser um inteiro entre **1** (ruim) e **5** (excelente).
    """
    try:
        # TODO: persistir no banco de dados em produção
        logger.info(
            "Chat feedback received",
            extra={
                "session_id": body.session_id,
                "message_id": body.message_id,
                "rating": body.rating,
                "helpful": body.helpful,
                "accurate": body.accurate,
            },
        )

        return FeedbackResponse(
            success=True,
            message="Feedback recebido com sucesso",
            feedback_id=f"fb_{body.session_id}_{body.message_id}",
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("Failed to submit feedback")
        raise HTTPException(status_code=500, detail=f"Erro ao submeter feedback: {e}")