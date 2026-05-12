"""
XAI API Routes
Rotas da API para Explainable AI (XAI)
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone

from app.ml.xai_integration import (
    xai_integration_service,
    XAIExplanation,
    UserFeedback,
    ExplanationFactor,
)
from app.core.logger import logger

router = APIRouter(prefix="/xai", tags=["XAI"])


# ─────────────────────────── request models ──────────────────

class ExplanationRequest(BaseModel):
    """Request para geração de explicação completa."""
    recommendation_id: str = Field(..., min_length=1)
    user_query: str = Field(..., min_length=1, max_length=2000)
    recommendation: str = Field(..., min_length=1, max_length=5000)
    context: Dict[str, Any] = Field(default_factory=dict)
    sources: List[Dict[str, Any]] = Field(default_factory=list)


class FactorsRequest(BaseModel):
    """Request para análise de fatores influentes."""
    recommendation: str = Field(..., min_length=1, max_length=5000)
    context: Dict[str, Any] = Field(default_factory=dict)
    sources: List[Dict[str, Any]] = Field(default_factory=list)


class AlternativesRequest(BaseModel):
    """Request para geração de alternativas."""
    recommendation: str = Field(..., min_length=1, max_length=5000)
    context: Dict[str, Any] = Field(default_factory=dict)
    factors: List[Dict[str, Any]] = Field(..., min_length=1)


class LimitationsRequest(BaseModel):
    """Request para identificação de limitações."""
    recommendation: str = Field(..., min_length=1, max_length=5000)
    context: Dict[str, Any] = Field(default_factory=dict)


class CompareRequest(BaseModel):
    """Request para comparação de recomendações."""
    recommendations: List[Dict[str, Any]] = Field(..., min_length=2, max_length=10)
    context: Dict[str, Any] = Field(default_factory=dict)


class FeedbackRequest(BaseModel):
    """Request para feedback do usuário."""
    recommendation_id: str = Field(..., min_length=1)
    helpful: bool
    clear: bool
    trustworthy: bool
    factors_useful: List[str] = Field(default_factory=list)
    additional_comments: Optional[str] = Field(None, max_length=2000)


# ─────────────────────────── response models ─────────────────

class ExplanationResponse(BaseModel):
    """Resposta para explicação gerada."""
    success: bool
    data: Optional[XAIExplanation] = None
    error: Optional[str] = None
    processing_time: float = 0.0


class FactorItem(BaseModel):
    """Fator individual na análise."""
    name: str
    weight: float
    description: str = ""
    category: Optional[str] = None


class FactorsResponse(BaseModel):
    """Resposta para análise de fatores."""
    success: bool
    factors: List[Dict[str, Any]]
    total_factors: int


class AlternativeItem(BaseModel):
    """Alternativa individual."""
    title: str
    description: str
    score: Optional[float] = None


class AlternativesResponse(BaseModel):
    """Resposta para geração de alternativas."""
    success: bool
    alternatives: List[Dict[str, Any]]
    total_alternatives: int


class LimitationsResponse(BaseModel):
    """Resposta para identificação de limitações."""
    success: bool
    limitations: List[str]
    total_limitations: int


class ComparisonItem(BaseModel):
    """Item individual na comparação."""
    recommendation: Dict[str, Any]
    explanation: Dict[str, Any]
    rank: int


class CompareResponse(BaseModel):
    """Resposta para comparação de recomendações."""
    success: bool
    comparisons: List[ComparisonItem]
    total_compared: int
    best_match: Optional[ComparisonItem] = None


class FeedbackResponse(BaseModel):
    """Resposta para submissão de feedback."""
    success: bool
    message: str
    feedback_id: str
    timestamp: str


class FeedbackStatsResponse(BaseModel):
    """Resposta para estatísticas de feedback."""
    success: bool
    stats: Dict[str, Any]
    recommendation_id: Optional[str] = None


class XAIHealthResponse(BaseModel):
    """Resposta para health check do XAI."""
    status: str
    services: Dict[str, Any] = {}
    capabilities: List[str] = []
    timestamp: str
    error: Optional[str] = None


class StoredExplanationResponse(BaseModel):
    """Resposta para busca de explicação armazenada."""
    success: bool
    recommendation_id: str
    explanation: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


# ─────────────────────────── helpers ─────────────────────────

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _utcnow_iso() -> str:
    return _utcnow().isoformat()


def _safe_confidence(explanation_dict: Dict[str, Any]) -> float:
    """Extrai confiança de um dict de explicação de forma segura."""
    inner = explanation_dict.get("explanation", {})
    if isinstance(inner, dict):
        return inner.get("confidence", 0.0)
    return 0.0


# ─────────────────────────── routes ──────────────────────────

@router.post(
    "/explain",
    response_model=ExplanationResponse,
    summary="Gerar explicação XAI",
)
async def generate_explanation(body: ExplanationRequest):
    """
    Gera uma explicação completa para uma recomendação usando XAI.

    Inclui fatores influentes, fontes consideradas, alternativas
    e limitações identificadas.
    """
    try:
        logger.info(
            "XAI explanation requested",
            extra={"recommendation_id": body.recommendation_id},
        )

        explanation = await xai_integration_service.generate_explanation(
            recommendation_id=body.recommendation_id,
            user_query=body.user_query,
            recommendation=body.recommendation,
            context=body.context,
            sources=body.sources,
        )

        return ExplanationResponse(
            success=True,
            data=explanation,
            processing_time=explanation.processing_time,
        )
    except Exception as e:
        logger.exception("XAI explanation generation failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar explicação: {e}",
        )


@router.post(
    "/factors",
    response_model=FactorsResponse,
    summary="Analisar fatores influentes",
)
async def analyze_factors(body: FactorsRequest):
    """
    Analisa os fatores que influenciaram uma recomendação,
    sem gerar a explicação completa.

    Retorna cada fator com seu peso e descrição.
    """
    try:
        factors = await xai_integration_service.analyze_factors(
            body.recommendation, body.context, body.sources
        )

        return FactorsResponse(
            success=True,
            factors=[f.dict() for f in factors],
            total_factors=len(factors),
        )
    except Exception as e:
        logger.exception("Factor analysis failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao analisar fatores: {e}",
        )


@router.post(
    "/alternatives",
    response_model=AlternativesResponse,
    summary="Gerar alternativas",
)
async def generate_alternatives(body: AlternativesRequest):
    """
    Gera alternativas à recomendação original com base nos
    fatores identificados e no contexto do usuário.
    """
    try:
        factor_objects = [ExplanationFactor(**f) for f in body.factors]

        alternatives = await xai_integration_service.generate_alternatives(
            body.recommendation, body.context, factor_objects
        )

        return AlternativesResponse(
            success=True,
            alternatives=[alt.dict() for alt in alternatives],
            total_alternatives=len(alternatives),
        )
    except (TypeError, ValueError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"Formato de fatores inválido: {e}",
        )
    except Exception as e:
        logger.exception("Alternatives generation failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar alternativas: {e}",
        )


@router.post(
    "/limitations",
    response_model=LimitationsResponse,
    summary="Identificar limitações",
)
async def identify_limitations(body: LimitationsRequest):
    """
    Identifica limitações e ressalvas sobre uma recomendação,
    promovendo transparência nas sugestões da IA.
    """
    try:
        limitations = await xai_integration_service.identify_limitations(
            body.recommendation, body.context
        )

        return LimitationsResponse(
            success=True,
            limitations=limitations,
            total_limitations=len(limitations),
        )
    except Exception as e:
        logger.exception("Limitations identification failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao identificar limitações: {e}",
        )


@router.post(
    "/compare",
    response_model=CompareResponse,
    summary="Comparar recomendações",
)
async def compare_recommendations(body: CompareRequest):
    """
    Compara múltiplas recomendações gerando explicações XAI para
    cada uma e ordenando por confiança.

    Recomendações que falharem na análise são ignoradas silenciosamente.
    """
    try:
        comparisons: list[ComparisonItem] = []

        for i, rec in enumerate(body.recommendations):
            try:
                explanation = await xai_integration_service.generate_explanation(
                    recommendation_id=f"compare_{i}_{rec.get('id', i)}",
                    user_query=rec.get("query", "Comparação"),
                    recommendation=rec.get("recommendation", ""),
                    context=body.context,
                    sources=rec.get("sources", []),
                )

                comparisons.append(
                    ComparisonItem(
                        recommendation=rec,
                        explanation=explanation.dict(),
                        rank=i + 1,
                    )
                )
            except Exception:
                logger.warning(
                    "Comparison item failed, skipping",
                    extra={"index": i, "rec_id": rec.get("id")},
                )

        comparisons.sort(
            key=lambda c: _safe_confidence(c.explanation),
            reverse=True,
        )

        # Re-assign ranks after sorting
        for rank, item in enumerate(comparisons, start=1):
            item.rank = rank

        return CompareResponse(
            success=True,
            comparisons=comparisons,
            total_compared=len(comparisons),
            best_match=comparisons[0] if comparisons else None,
        )
    except Exception as e:
        logger.exception("Recommendation comparison failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao comparar recomendações: {e}",
        )


@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    summary="Enviar feedback",
)
async def submit_feedback(body: FeedbackRequest):
    """
    Registra o feedback do usuário sobre uma explicação XAI.

    O feedback é usado para melhorar a qualidade das explicações futuras.
    """
    try:
        feedback = UserFeedback(
            recommendation_id=body.recommendation_id,
            helpful=body.helpful,
            clear=body.clear,
            trustworthy=body.trustworthy,
            factors_useful=body.factors_useful,
            additional_comments=body.additional_comments,
            timestamp=_utcnow(),
        )

        success = await xai_integration_service.submit_feedback(feedback)

        if not success:
            raise HTTPException(status_code=500, detail="Erro ao salvar feedback")

        return FeedbackResponse(
            success=True,
            message="Feedback recebido com sucesso",
            feedback_id=f"xai_fb_{body.recommendation_id}",
            timestamp=_utcnow_iso(),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Feedback submission failed")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao submeter feedback: {e}",
        )


@router.get(
    "/feedback/stats",
    response_model=FeedbackStatsResponse,
    summary="Estatísticas de feedback",
)
async def get_feedback_stats(
    recommendation_id: Optional[str] = Query(
        default=None, description="Filtrar por recomendação específica"
    ),
):
    """
    Retorna estatísticas agregadas de feedback das explicações XAI.

    Opcionalmente filtra por uma recomendação específica.
    """
    try:
        stats = await xai_integration_service.get_feedback_stats(recommendation_id)

        return FeedbackStatsResponse(
            success=True,
            stats=stats,
            recommendation_id=recommendation_id,
        )
    except Exception as e:
        logger.exception("Failed to fetch feedback stats")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter estatísticas: {e}",
        )


@router.get(
    "/health",
    response_model=XAIHealthResponse,
    summary="Health check",
)
async def health_check():
    """Verifica a saúde do serviço XAI e de suas dependências."""
    try:
        health = await xai_integration_service.health_check()

        return XAIHealthResponse(
            status=health["status"],
            services=health,
            capabilities=health.get("capabilities", []),
            timestamp=_utcnow_iso(),
        )
    except Exception as e:
        logger.exception("XAI health check failed")
        return XAIHealthResponse(
            status="unhealthy",
            error=str(e),
            timestamp=_utcnow_iso(),
        )


@router.get(
    "/explanation/{recommendation_id}",
    response_model=StoredExplanationResponse,
    summary="Buscar explicação armazenada",
)
async def get_explanation(recommendation_id: str):
    """
    Busca uma explicação previamente gerada pelo ID da recomendação.

    Retorna 404 caso não exista registro armazenado.
    """
    try:
        # TODO: implementar busca no banco de dados em produção
        explanation = await xai_integration_service.get_stored_explanation(
            recommendation_id
        )

        if explanation is None:
            raise HTTPException(
                status_code=404,
                detail=f"Explicação não encontrada para '{recommendation_id}'",
            )

        return StoredExplanationResponse(
            success=True,
            recommendation_id=recommendation_id,
            explanation=explanation.dict(),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to retrieve stored explanation")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter explicação: {e}",
        )