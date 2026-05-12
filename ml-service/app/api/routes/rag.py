"""
RAG API Routes
Rotas da API para integração RAG com TinyAya
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
import logging

from app.ml.rag_integration import (
    rag_integration_service,
    RAGQueryRequest,
    RAGResponse,
)
from app.core.logger import logger

router = APIRouter(prefix="/rag", tags=["RAG"])


# ─────────────────────────── request models ──────────────────

class ExplainRequest(BaseModel):
    """Corpo da requisição para explicação de resposta."""
    answer: str = Field(..., min_length=1, max_length=5000)
    documents: List[Dict[str, Any]] = Field(..., min_length=1)
    confidence: float = Field(..., ge=0.0, le=1.0)


class FactCheckRequest(BaseModel):
    """Corpo da requisição para verificação factual."""
    claim: str = Field(..., min_length=1, max_length=2000)
    context: List[Dict[str, Any]] = Field(default_factory=list)


class RAGFeedbackRequest(BaseModel):
    """Corpo da requisição para feedback RAG."""
    query_id: str = Field(..., min_length=1)
    helpful: bool
    accurate: bool
    sources_useful: bool
    comments: Optional[str] = Field(None, max_length=1000)


# ─────────────────────────── response models ─────────────────

class RAGQueryResponse(BaseModel):
    """Resposta para consultas RAG."""
    success: bool
    data: Optional[RAGResponse] = None
    error: Optional[str] = None
    processing_time: float


class DocumentSearchResponse(BaseModel):
    """Resposta para busca de documentos."""
    success: bool
    documents: List[Dict[str, Any]]
    total_results: int


class ExplainResponse(BaseModel):
    """Resposta para explicação de resposta."""
    success: bool
    explanation: Dict[str, Any]


class FactCheckResponse(BaseModel):
    """Resposta para verificação factual."""
    success: bool
    result: Dict[str, Any]


class RAGHealthResponse(BaseModel):
    """Resposta para health check do RAG."""
    status: str
    services: Dict[str, Any] = {}
    capabilities: List[str] = []
    timestamp: str
    error: Optional[str] = None


class RAGStatsResponse(BaseModel):
    """Resposta para estatísticas do RAG."""
    success: bool
    total_queries: int = 0
    avg_processing_time: float = 0.0
    avg_confidence: float = 0.0
    most_searched_categories: List[str] = []
    success_rate: float = 0.0


class RAGFeedbackResponse(BaseModel):
    """Resposta para feedback RAG."""
    success: bool
    message: str
    feedback_id: str
    timestamp: str


# ─────────────────────────── helpers ─────────────────────────

def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# Lazy import to avoid circular dependencies at module level
_tiny_aya_connector = None


def _get_tiny_aya_connector():
    global _tiny_aya_connector
    if _tiny_aya_connector is None:
        from app.models.tiny_aya_connector import tiny_aya_connector
        _tiny_aya_connector = tiny_aya_connector
    return _tiny_aya_connector


# ─────────────────────────── routes ──────────────────────────

@router.post("/query", response_model=RAGQueryResponse, summary="Consulta RAG")
async def query_rag(request: RAGQueryRequest):
    """
    Realiza uma consulta RAG completa usando TinyAya.

    Busca documentos relevantes, gera uma resposta contextualizada
    e inclui metadados de confiança e fontes.
    """
    try:
        logger.info(
            "RAG query received",
            extra={"preview": request.query[:100]},
        )

        response = await rag_integration_service.generate_answer_with_rag(request)

        return RAGQueryResponse(
            success=True,
            data=response,
            processing_time=response.processing_time,
        )
    except Exception as e:
        logger.exception("RAG query failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar consulta RAG: {e}",
        )


@router.post(
    "/search",
    response_model=DocumentSearchResponse,
    summary="Buscar documentos",
)
async def search_documents(request: RAGQueryRequest):
    """
    Busca documentos relevantes **sem** gerar resposta.

    Útil para pré-visualização de fontes ou depuração de contexto.
    """
    try:
        documents = await rag_integration_service.search_documents(request)

        return DocumentSearchResponse(
            success=True,
            documents=[doc.dict() for doc in documents],
            total_results=len(documents),
        )
    except Exception as e:
        logger.exception("Document search failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar documentos: {e}",
        )


@router.post(
    "/explain",
    response_model=ExplainResponse,
    summary="Explicar resposta",
)
async def explain_answer(body: ExplainRequest):
    """
    Gera uma explicação XAI detalhada para uma resposta RAG já produzida.

    Detalha quais documentos influenciaram a resposta, o nível de
    confiança e o raciocínio por trás da geração.
    """
    try:
        explanation = await rag_integration_service.generate_explanation(
            answer=body.answer,
            documents=body.documents,
            confidence=body.confidence,
        )

        return ExplainResponse(success=True, explanation=explanation)
    except Exception as e:
        logger.exception("Explanation generation failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar explicação: {e}",
        )


@router.post(
    "/fact-check",
    response_model=FactCheckResponse,
    summary="Verificação factual",
)
async def factual_check(body: FactCheckRequest):
    """
    Verifica a veracidade de uma afirmação com base no contexto fornecido.

    Retorna um veredito (*supported*, *refuted* ou *inconclusive*) e a
    justificativa associada.
    """
    try:
        connector = _get_tiny_aya_connector()
        result = await connector.generate_factual_check(body.claim, body.context)

        return FactCheckResponse(success=True, result=result)
    except Exception as e:
        logger.exception("Factual check failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro na verificação factual: {e}",
        )


@router.get(
    "/health",
    response_model=RAGHealthResponse,
    summary="Health check",
)
async def health_check():
    """Verifica a saúde do serviço RAG e de suas dependências."""
    try:
        health = await rag_integration_service.health_check()

        return RAGHealthResponse(
            status=health["status"],
            services=health,
            capabilities=health.get("capabilities", []),
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("RAG health check failed")
        return RAGHealthResponse(
            status="unhealthy",
            error=str(e),
            timestamp=_utcnow_iso(),
        )


@router.get(
    "/stats",
    response_model=RAGStatsResponse,
    summary="Estatísticas de uso",
)
async def get_rag_stats():
    """
    Retorna métricas agregadas de uso do serviço RAG.

    > **Nota:** em desenvolvimento retorna valores zerados.
    > Em produção, os dados virão do banco de métricas.
    """
    try:
        # TODO: buscar estatísticas reais do banco de dados em produção
        return RAGStatsResponse(
            success=True,
            total_queries=0,
            avg_processing_time=0.0,
            avg_confidence=0.0,
            most_searched_categories=[],
            success_rate=0.0,
        )
    except Exception as e:
        logger.exception("Failed to fetch RAG stats")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter estatísticas: {e}",
        )


@router.post(
    "/feedback",
    response_model=RAGFeedbackResponse,
    summary="Enviar feedback",
)
async def submit_rag_feedback(body: RAGFeedbackRequest):
    """
    Registra o feedback do usuário sobre uma resposta RAG.

    Avalia utilidade, precisão e qualidade das fontes retornadas.
    """
    try:
        # TODO: persistir no banco de dados em produção
        logger.info(
            "RAG feedback received",
            extra={
                "query_id": body.query_id,
                "helpful": body.helpful,
                "accurate": body.accurate,
                "sources_useful": body.sources_useful,
            },
        )

        return RAGFeedbackResponse(
            success=True,
            message="Feedback recebido com sucesso",
            feedback_id=f"rag_fb_{body.query_id}",
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("RAG feedback submission failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao submeter feedback: {e}",
        )