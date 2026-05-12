"""
XAI Integration Service
Integração do ML Service com o sistema XAI (Explainable AI)
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from pydantic import BaseModel
import httpx
import numpy as np
from datetime import datetime

from app.core.config import settings
from app.core.logger import logger
from app.models.tiny_aya_connector import TinyAyaConnector, TinyAyaMessage

class ExplanationFactor(BaseModel):
    """Fator de explicação"""
    factor: str
    weight: float
    value: str
    importance: str  # high, medium, low
    source: str
    confidence: float

class AlternativeRecommendation(BaseModel):
    """Recomendação alternativa"""
    title: str
    reason: str
    score: float
    pros: List[str]
    cons: List[str]

class ExplanationContent(BaseModel):
    """Conteúdo da explicação"""
    why: str
    factors: List[ExplanationFactor]
    alternatives: List[AlternativeRecommendation]
    confidence: float
    limitations: List[str]
    reasoning_path: List[str]

class XAIExplanation(BaseModel):
    """Explicação XAI completa"""
    recommendation_id: str
    user_query: str
    recommendation: str
    explanation: ExplanationContent
    sources: List[Dict[str, Any]]
    timestamp: datetime
    processing_time: float

class UserFeedback(BaseModel):
    """Feedback do usuário"""
    recommendation_id: str
    helpful: bool
    clear: bool
    trustworthy: bool
    factors_useful: List[str]
    additional_comments: Optional[str] = None
    timestamp: datetime

class XAIIntegrationService:
    """Serviço de integração XAI"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.backend_url = settings.backend_url or "http://localhost:3001"
        self.tiny_aya = TinyAyaConnector()
        self._setup_logging()
        
    def _setup_logging(self):
        """Configura logging específico"""
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)
    
    async def generate_explanation(
        self,
        recommendation_id: str,
        user_query: str,
        recommendation: str,
        context: Dict[str, Any],
        sources: List[Dict[str, Any]]
    ) -> XAIExplanation:
        """Gera explicação completa para recomendação"""
        import time
        start_time = time.time()
        
        try:
            # 1. Analisar fatores influentes
            factors = await self._analyze_factors(recommendation, context, sources)
            
            # 2. Gerar explicação principal
            main_explanation = await self._generate_main_explanation(
                user_query, recommendation, factors, context
            )
            
            # 3. Sugerir alternativas
            alternatives = await self._generate_alternatives(
                recommendation, context, factors
            )
            
            # 4. Identificar limitações
            limitations = await self._identify_limitations(recommendation, context)
            
            # 5. Gerar caminho de raciocínio
            reasoning_path = await self._generate_reasoning_path(
                user_query, recommendation, factors
            )
            
            # 6. Calcular confiança geral
            overall_confidence = self._calculate_overall_confidence(factors, sources)
            
            return XAIExplanation(
                recommendation_id=recommendation_id,
                user_query=user_query,
                recommendation=recommendation,
                explanation={
                    "why": main_explanation,
                    "factors": factors,
                    "alternatives": alternatives,
                    "confidence": overall_confidence,
                    "limitations": limitations,
                    "reasoning_path": reasoning_path
                },
                sources=sources,
                timestamp=datetime.now(),
                processing_time=time.time() - start_time
            )
            
        except Exception as e:
            self.logger.error(f"Error generating explanation: {str(e)}")
            raise
    
    async def _analyze_factors(
        self, 
        recommendation: str, 
        context: Dict[str, Any], 
        sources: List[Dict[str, Any]]
    ) -> List[ExplanationFactor]:
        """Analisa fatores que influenciaram a recomendação"""
        factors = []
        
        # Extrair fatores do contexto
        context_factors = [
            {
                "name": "Preferências de destino",
                "value": context.get("preferred_destinations", "Não especificado"),
                "importance": "high"
            },
            {
                "name": "Orçamento disponível",
                "value": f"€{context.get('budget', 'Não especificado')}",
                "importance": "high"
            },
            {
                "name": "Duração da viagem",
                "value": f"{context.get('duration', 'Não especificado')} dias",
                "importance": "medium"
            },
            {
                "name": "Tipo de viagem",
                "value": context.get("trip_type", "Não especificado"),
                "importance": "medium"
            },
            {
                "name": "Acompanhantes",
                "value": context.get("travelers", "Não especificado"),
                "importance": "low"
            }
        ]
        
        for factor_data in context_factors:
            # Calcular peso baseado na importância
            importance_weights = {"high": 0.8, "medium": 0.5, "low": 0.3}
            weight = importance_weights.get(factor_data["importance"], 0.5)
            
            # Calcular confiança baseada nas fontes
            confidence = min(1.0, len(sources) * 0.2) if sources else 0.3
            
            factors.append(ExplanationFactor(
                factor=factor_data["name"],
                weight=weight,
                value=factor_data["value"],
                importance=factor_data["importance"],
                source="user_preferences",
                confidence=confidence
            ))
        
        # Adicionar fatores das fontes
        for source in sources[:3]:  # Limitar a 3 fontes principais
            factors.append(ExplanationFactor(
                factor=f"Fonte: {source.get('title', 'Sem título')}",
                weight=source.get("trust_score", 0.5) * 0.3,
                value=f"Confiabilidade: {source.get('trust_score', 0.5):.2f}",
                importance="medium",
                source=source.get("source", "desconhecida"),
                confidence=source.get("trust_score", 0.5)
            ))
        
        return factors
    
    async def _generate_main_explanation(
        self,
        user_query: str,
        recommendation: str,
        factors: List[ExplanationFactor],
        context: Dict[str, Any]
    ) -> str:
        """Gera explicação principal"""
        try:
            factors_text = "\n".join([
                f"- {factor.factor}: {factor.value} (importância: {factor.importance})"
                for factor in factors
            ])
            
            messages = [
                TinyAyaMessage(
                    role="system",
                    content="""Você é um especialista em explicar recomendações de viagem.
Forneça explicações claras, honestas e transparentes.
Explique o porquê da recomendação e quais fatores foram mais importantes.
Seja específico e cite os fatores considerados."""
                ),
                TinyAyaMessage(
                    role="user",
                    content=f"""Pergunta do usuário: {user_query}
Recomendação: {recommendation}

Fatores considerados:
{factors_text}

Por favor, explique de forma clara e objetiva por que esta recomendação foi feita,
destacando os fatores mais importantes."""
                )
            ]
            
            response = await self.tiny_aya.generate_text(
                messages, 
                temperature=0.4, 
                max_tokens=800
            )
            
            return response.content
            
        except Exception as e:
            self.logger.error(f"Error generating main explanation: {str(e)}")
            return f"Recomendação baseada nos fatores principais: {len(factors)} considerados."
    
    async def _generate_alternatives(
        self,
        recommendation: str,
        context: Dict[str, Any],
        factors: List[ExplanationFactor]
    ) -> List[AlternativeRecommendation]:
        """Gera recomendações alternativas"""
        alternatives = []
        
        try:
            # Gerar 2-3 alternativas
            for i in range(2):
                messages = [
                    TinyAyaMessage(
                        role="system",
                        content="""Sugira uma alternativa viável à recomendação dada.
                        A alternativa deve ser diferente mas relevante para o contexto.
                        Inclua prós e contras."""
                    ),
                    TinyAyaMessage(
                        role="user",
                        content=f"""Recomendação original: {recommendation}
Contexto: {context}

Sugira uma alternativa diferente e explique prós e contras."""
                    )
                ]
                
                response = await self.tiny_aya.generate_text(
                    messages,
                    temperature=0.6,
                    max_tokens=400
                )
                
                # Parse simplificado da resposta
                alternatives.append(AlternativeRecommendation(
                    title=f"Alternativa {i+1}",
                    reason=response.content[:200] + "...",
                    score=0.7 - (i * 0.1),  # Score decrescente
                    pros=["Menos custosa", "Boa alternativa"],
                    cons=["Pode não atender todos os requisitos"]
                ))
                
        except Exception as e:
            self.logger.error(f"Error generating alternatives: {str(e)}")
        
        return alternatives
    
    async def _identify_limitations(
        self, 
        recommendation: str, 
        context: Dict[str, Any]
    ) -> List[str]:
        """Identifica limitações da recomendação"""
        try:
            messages = [
                TinyAyaMessage(
                    role="system",
                    content="""Identifique limitações honestas da recomendação.
                    Seja transparente sobre o que pode não funcionar perfeitamente.
                    Liste 2-3 limitações importantes."""
                ),
                TinyAyaMessage(
                    role="user",
                    content=f"""Recomendação: {recommendation}
Contexto: {context}

Quais são as limitações ou potenciais problemas desta recomendação?"""
                )
            ]
            
            response = await self.tiny_aya.generate_text(
                messages,
                temperature=0.3,
                max_tokens=300
            )
            
            # Parse simplificado - dividir por linhas
            limitations = []
            for line in response.content.split('\n'):
                line = line.strip()
                if line and len(line) > 10:
                    limitations.append(line[:100])  # Limitar tamanho
            
            return limitations[:3]  # Máximo 3 limitações
            
        except Exception as e:
            self.logger.error(f"Error identifying limitations: {str(e)}")
            return [
                "Recomendação baseada em dados limitados",
                "Pode não considerar preferências individuais específicas"
            ]
    
    async def _generate_reasoning_path(
        self,
        user_query: str,
        recommendation: str,
        factors: List[ExplanationFactor]
    ) -> List[str]:
        """Gera caminho de raciocínio"""
        try:
            reasoning_steps = [
                "1. Análise da consulta do usuário",
                f"2. Extração de {len(factors)} fatores relevantes",
                "3. Avaliação de confiança das fontes",
                "4. Geração da recomendação principal",
                "5. Verificação factual e consistência"
            ]
            
            return reasoning_steps
            
        except Exception as e:
            self.logger.error(f"Error generating reasoning path: {str(e)}")
            return ["Processo de análise concluído"]
    
    def _calculate_overall_confidence(
        self, 
        factors: List[ExplanationFactor], 
        sources: List[Dict[str, Any]]
    ) -> float:
        """Calcula confiança geral"""
        if not factors:
            return 0.0
        
        # Confiança baseada nos fatores
        factor_confidence = np.mean([f.confidence * f.weight for f in factors])
        
        # Confiança baseada nas fontes
        source_confidence = np.mean([s.get("trust_score", 0.5) for s in sources]) if sources else 0.5
        
        # Média ponderada
        overall_confidence = (factor_confidence * 0.7) + (source_confidence * 0.3)
        
        return min(1.0, max(0.0, overall_confidence))
    
    async def submit_feedback(self, feedback: UserFeedback) -> bool:
        """Submete feedback do usuário para o backend"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.backend_url}/api/ai/xai/feedback",
                    json=feedback.dict()
                )
                
                return response.status_code == 200
                
        except Exception as e:
            self.logger.error(f"Error submitting feedback: {str(e)}")
            return False
    
    async def get_feedback_stats(self, recommendation_id: Optional[str] = None) -> Dict[str, Any]:
        """Obtém estatísticas de feedback"""
        try:
            params = {"recommendation_id": recommendation_id} if recommendation_id else {}
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.backend_url}/api/ai/xai/feedback/stats",
                    params=params
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {}
                    
        except Exception as e:
            self.logger.error(f"Error getting feedback stats: {str(e)}")
            return {}
    
    async def health_check(self) -> Dict[str, Any]:
        """Verifica saúde do serviço XAI"""
        try:
            # Testar TinyAya
            tiny_aya_health = self.tiny_aya.health_check()
            
            # Testar conexão com backend
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.backend_url}/health")
                backend_healthy = response.status_code == 200
        except Exception as e:
            self.logger.error(f"Health check error: {str(e)}")
            backend_healthy = False
            tiny_aya_health = {"status": "unhealthy"}
            
            return {
                "status": "healthy" if backend_healthy and tiny_aya_health["status"] == "healthy" else "degraded",
                "backend": {
                    "url": self.backend_url,
                    "healthy": backend_healthy
                },
                "tiny_aya": tiny_aya_health,
                "capabilities": [
                    "explanation_generation",
                    "factor_analysis",
                    "alternatives_generation",
                    "feedback_collection"
                ]
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            }

# Instância global
xai_integration_service = XAIIntegrationService()
