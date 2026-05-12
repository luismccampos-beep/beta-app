"""
RAG Integration Service
Integração do ML Service com o sistema RAG do backend
"""

import re
import time
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

import httpx
import numpy as np
from pydantic import BaseModel

from app.core.config import settings
from app.models.tiny_aya_connector import TinyAyaConnector


class RAGDocument(BaseModel):
    id: str
    title: str
    content: str
    source: str
    url: Optional[str] = None
    last_updated: str
    trust_score: float
    category: str
    relevance_score: Optional[float] = None


class RAGQueryRequest(BaseModel):
    query: str
    max_results: int = 5
    min_trust_score: float = 0.5
    categories: Optional[List[str]] = None
    user_preferences: Optional[Dict[str, Any]] = None


class RAGResponse(BaseModel):
    answer: str
    sources: List[RAGDocument]
    confidence: float
    explanation: str
    factual_checks: List[Dict[str, Any]]
    processing_time: float
    query_embedding: Optional[List[float]] = None


class RAGIntegrationService:
    """Serviço de integração RAG"""

    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)
        self.backend_url = getattr(settings, "backend_url", None) or "http://localhost:3001"
        self.tiny_aya = TinyAyaConnector()
        self._setup_logging()

    def _setup_logging(self) -> None:
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(
                logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
            )
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

    # ------------------------------------------------------------------ #
    # Document search                                                      #
    # ------------------------------------------------------------------ #

    async def search_documents(self, request: RAGQueryRequest) -> List[RAGDocument]:
        """Busca documentos no backend RAG."""
        try:
            # The backend currently exposes a simplified RAG endpoint at /api/ai/ask.
            # It returns an answer and (optionally) sources; it does not support raw search.
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.backend_url}/api/ai/ask",
                    json={"query": request.query},
                )

            if response.status_code != 200:
                self.logger.error("RAG ask error: %s", response.status_code)
                return []

            data = response.json()
            sources = ((data.get("data") or {}).get("sources")) or []

            documents: List[RAGDocument] = []
            for src in sources[: request.max_results]:
                documents.append(
                    RAGDocument(
                        id=str(src.get("id", "")),
                        title=str(src.get("title", "")),
                        content=str(src.get("content", "")),
                        source=str(src.get("source", "")),
                        url=None,
                        last_updated=datetime.now().isoformat(),
                        trust_score=float(src.get("trustScore", 0.5)),
                        category=str(src.get("category", "general")),
                        relevance_score=None,
                    )
                )

            return documents

        except Exception:
            self.logger.exception("Error searching documents")
            return []

    # ------------------------------------------------------------------ #
    # Main RAG generation                                                  #
    # ------------------------------------------------------------------ #

    async def generate_answer_with_rag(self, request: RAGQueryRequest) -> RAGResponse:
        """Gera resposta usando RAG."""
        start = time.time()

        def elapsed() -> float:
            return time.time() - start

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.backend_url}/api/ai/ask",
                    json={"query": request.query},
                )

            if response.status_code != 200:
                self.logger.error("Backend /api/ai/ask error: %s", response.status_code)
                return RAGResponse(
                    answer="Ocorreu um erro ao consultar o sistema de IA.",
                    sources=[],
                    confidence=0.0,
                    explanation="Erro ao consultar backend",
                    factual_checks=[],
                    processing_time=elapsed(),
                )

            data = response.json()
            payload = data.get("data") or {}

            sources_raw = payload.get("sources") or []
            documents: List[RAGDocument] = []
            for src in sources_raw[: request.max_results]:
                documents.append(
                    RAGDocument(
                        id=str(src.get("id", "")),
                        title=str(src.get("title", "")),
                        content=str(src.get("content", "")),
                        source=str(src.get("source", "")),
                        url=None,
                        last_updated=datetime.now().isoformat(),
                        trust_score=float(src.get("trustScore", 0.5)),
                        category=str(src.get("category", "general")),
                        relevance_score=None,
                    )
                )

            return RAGResponse(
                answer=str(payload.get("answer", "")),
                sources=documents,
                confidence=float(payload.get("confidence", 0.0)),
                explanation=str(payload.get("explanation", "")),
                factual_checks=[],
                processing_time=elapsed(),
            )

        except Exception:
            self.logger.exception("Error generating RAG answer")
            return RAGResponse(
                answer="Ocorreu um erro ao processar sua pergunta.",
                sources=[],
                confidence=0.0,
                explanation="Erro no processamento",
                factual_checks=[],
                processing_time=elapsed(),
            )

    # ------------------------------------------------------------------ #
    # Factual checks                                                       #
    # ------------------------------------------------------------------ #

    async def _perform_factual_checks(
        self,
        answer: str,
        documents: List[RAGDocument],
    ) -> List[Dict[str, Any]]:
        """Realiza verificações factuais."""
        checks: List[Dict[str, Any]] = []

        try:
            claims = self._extract_verifiable_claims(answer)
            doc_context = [
                {"title": doc.title, "content": doc.content, "trust_score": doc.trust_score}
                for doc in documents
            ]

            for claim in claims[:3]:
                result = await self.tiny_aya.generate_factual_check(claim=claim, context=doc_context)
                checks.append(
                    {
                        "claim": claim,
                        "verified": result.get("verified", False),
                        "confidence": result.get("confidence", 0.0),
                        "explanation": result.get("explanation", ""),
                        "sources": result.get("sources", []),
                    }
                )

        except Exception:
            self.logger.exception("Error performing factual checks")

        return checks

    def _extract_verifiable_claims(self, text: str) -> List[str]:
        """Extrai afirmações verificáveis do texto."""
        patterns = [
            r"€\d+(?:\.\d{2})?",
            r"R\$\d+(?:\.\d{2})?",
            r"\d{1,2}\s*(?:de\s*)?\w+\s*de\s*\d{4}",
            r"\d+\s*(?:km|quilômetros)",
            r"\d+\s*(?:min|minutos)",
        ]

        claims: List[str] = []

        for pattern in patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 50)
                snippet = text[start:end].strip()
                if snippet:
                    claims.append(snippet)

        return list(dict.fromkeys(claims))

    # ------------------------------------------------------------------ #
    # Confidence & explanation                                             #
    # ------------------------------------------------------------------ #

    def _calculate_confidence(
        self,
        documents: List[RAGDocument],
        factual_checks: List[Dict[str, Any]],
    ) -> float:
        """Calcula confiança da resposta."""
        if not documents:
            return 0.0

        doc_confidence: float = float(np.mean([doc.trust_score for doc in documents]))

        if factual_checks:
            verified_ratio = (
                sum(1 for c in factual_checks if c.get("verified")) / len(factual_checks)
            )
            fact_confidence: float = float(
                np.mean([c.get("confidence", 0.5) for c in factual_checks])
            )
            confidence = doc_confidence * 0.6 + fact_confidence * verified_ratio * 0.4
        else:
            confidence = doc_confidence

        return float(np.clip(confidence, 0.0, 1.0))

    async def _generate_explanation(
        self,
        answer: str,
        documents: List[RAGDocument],
        confidence: float,
    ) -> str:
        """Gera explicação da resposta."""
        try:
            factors = [
                {
                    "name": f"Fonte: {doc.title}",
                    "value": f"Confiabilidade: {doc.trust_score:.2f}",
                    "weight": doc.trust_score,
                }
                for doc in documents[:3]
            ]

            avg_trust = float(np.mean([doc.trust_score for doc in documents]))

            tiny_aya_response = await self.tiny_aya.generate_explanation(
                recommendation=answer[:200] + ("..." if len(answer) > 200 else ""),
                factors=factors,
                user_context={
                    "confidence": confidence,
                    "num_sources": len(documents),
                    "avg_trust_score": avg_trust,
                },
            )
            return str(tiny_aya_response.content)

        except Exception:
            self.logger.exception("Error generating explanation")
            return (
                f"Resposta baseada em {len(documents)} fontes "
                f"com confiança média de {confidence:.2f}"
            )

    # ------------------------------------------------------------------ #
    # Health check                                                         #
    # ------------------------------------------------------------------ #

    async def health_check(self) -> Dict[str, Any]:
        """Verifica saúde do serviço."""
        backend_healthy = False

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.backend_url}/health")
                backend_healthy = response.status_code == 200
        except Exception:
            self.logger.warning("Backend health check failed")

        tiny_aya_health: Dict[str, Any] = self.tiny_aya.health_check()
        overall = backend_healthy and tiny_aya_health.get("status") == "healthy"

        return {
            "status": "healthy" if overall else "degraded",
            "backend": {"url": self.backend_url, "healthy": backend_healthy},
            "tiny_aya": tiny_aya_health,
            "capabilities": [
                "document_search",
                "rag_generation",
                "factual_verification",
                "explanation_generation",
            ],
        }


# Global instance
rag_integration_service = RAGIntegrationService()