"""
Unified AI Service
Serviço unificado que combina RAG e XAI com Gemini
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from pydantic import BaseModel
import uuid
from datetime import datetime

from app.core.config import settings
from app.core.logger import logger
from app.models.gemini_connector import GeminiConnector, GeminiMessage
from app.ml.rag_integration import rag_integration_service, RAGQueryRequest, RAGDocument
from app.ml.xai_integration import xai_integration_service, XAIExplanation

class UnifiedAIRequest(BaseModel):
    """Request unificado para IA"""
    query: str
    context: Optional[Dict[str, Any]] = None
    user_preferences: Optional[Dict[str, Any]] = None
    include_explanation: bool = True
    include_alternatives: bool = True
    max_sources: int = 5
    language: str = "pt"

class UnifiedAIResponse(BaseModel):
    """Response unificado da IA"""
    request_id: str
    answer: str
    sources: List[RAGDocument]
    explanation: Optional[XAIExplanation] = None
    alternatives: List[Dict[str, Any]] = []
    confidence: float
    processing_time: float
    timestamp: datetime
    language: str

class UnifiedAIService:
    """Serviço unificado de IA"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.llm = GeminiConnector()
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
    
    async def process_request(self, request: UnifiedAIRequest) -> UnifiedAIResponse:
        """Processa request unificado combinando RAG e XAI"""
        import time
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        try:
            self.logger.info(f"Processing unified AI request {request_id}: {request.query[:100]}...")
            
            # 1. Processar com RAG
            rag_request = RAGQueryRequest(
                query=request.query,
                max_results=request.max_sources,
                user_preferences=request.user_preferences or {},
                min_trust_score=0.5
            )
            
            rag_response = await rag_integration_service.generate_answer_with_rag(rag_request)
            
            # 2. Gerar explicação XAI se solicitado
            explanation = None
            alternatives = []
            
            if request.include_explanation:
                try:
                    explanation = await xai_integration_service.generate_explanation(
                        recommendation_id=request_id,
                        user_query=request.query,
                        recommendation=rag_response.answer,
                        context=request.context or {},
                        sources=[source.dict() for source in rag_response.sources]
                    )
                    
                    # Extrair alternativas da explicação
                    if request.include_alternatives:
                        alternatives = [
                            alt.dict() for alt in explanation.explanation.get("alternatives", [])
                        ]
                        
                except Exception as e:
                    self.logger.error(f"Error generating XAI explanation: {str(e)}")
            
            # 3. Melhorar resposta com Gemini se necessário
            enhanced_answer = await self._enhance_answer_with_context(
                rag_response.answer,
                request.context,
                request.language
            )
            
            return UnifiedAIResponse(
                request_id=request_id,
                answer=enhanced_answer,
                sources=rag_response.sources,
                explanation=explanation,
                alternatives=alternatives,
                confidence=rag_response.confidence,
                processing_time=time.time() - start_time,
                timestamp=datetime.now(),
                language=request.language
            )
            
        except Exception as e:
            self.logger.error(f"Error processing unified AI request: {str(e)}")
            raise
    
    async def _enhance_answer_with_context(
        self, 
        answer: str, 
        context: Optional[Dict[str, Any]], 
        language: str
    ) -> str:
        """Melhora resposta baseada no contexto do usuário"""
        if not context:
            return answer
        
        try:
            context_text = "\n".join([
                f"- {key}: {value}" for key, value in context.items()
            ])
            
            language_prompts = {
                "pt": "Melhore a resposta considerando o contexto do usuário.",
                "en": "Improve the answer considering the user context.",
                "es": "Mejora la respuesta considerando el contexto del usuario.",
                "fr": "Améliorez la réponse en considérant le contexte de l'utilisateur."
            }
            
            messages = [
                GeminiMessage(
                    role="system",
                    content=f"""Você é um assistente de viagem especializado.
{language_prompts.get(language, language_prompts["pt"])}
Seja mais pessoal e específico baseado no contexto.""",
                ),
                GeminiMessage(
                    role="user",
                    content=f"""Resposta original: {answer}

Contexto do usuário:
{context_text}

Por favor, melhore esta resposta considerando o contexto fornecido.
Mantenha a factualidade mas torne-a mais pessoal e relevante.""",
                ),
            ]

            response = await self.llm.generate_text(messages, temperature=0.3, max_tokens=900)
            return response.content or answer
            
        except Exception as e:
            self.logger.error(f"Error enhancing answer: {str(e)}")
            return answer
    
    async def get_travel_recommendation(
        self,
        destination: str,
        preferences: Dict[str, Any],
        budget: Optional[float] = None,
        duration: Optional[int] = None
    ) -> UnifiedAIResponse:
        """Gera recomendação de viagem completa"""
        
        # Construir query específica para viagem
        query_parts = [f"Recomendações para viagem para {destination}"]
        
        if budget:
            query_parts.append(f"com orçamento de €{budget}")
        if duration:
            query_parts.append(f"duração de {duration} dias")
        
        if preferences.get("travel_type"):
            query_parts.append(f"tipo: {preferences['travel_type']}")
        if preferences.get("activities"):
            query_parts.append(f"atividades: {', '.join(preferences['activities'])}")
        
        query = " ".join(query_parts)
        
        # Contexto enriquecido
        enhanced_context = {
            "destination": destination,
            "budget": budget,
            "duration": duration,
            "travel_type": preferences.get("travel_type"),
            "activities": preferences.get("activities", []),
            "accommodation": preferences.get("accommodation"),
            "transport": preferences.get("transport"),
            "special_requirements": preferences.get("special_requirements", [])
        }
        
        request = UnifiedAIRequest(
            query=query,
            context=enhanced_context,
            user_preferences=preferences,
            include_explanation=True,
            include_alternatives=True,
            max_sources=8,
            language="pt"
        )
        
        return await self.process_request(request)
    
    async def compare_destinations(
        self,
        destinations: List[str],
        preferences: Dict[str, Any],
        criteria: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Compara múltiplos destinos"""
        
        comparisons = []
        
        for destination in destinations:
            try:
                response = await self.get_travel_recommendation(
                    destination=destination,
                    preferences=preferences
                )
                
                comparisons.append({
                    "destination": destination,
                    "recommendation": response.dict(),
                    "score": response.confidence
                })
                
            except Exception as e:
                self.logger.error(f"Error comparing {destination}: {str(e)}")
                continue
        
        # Ordenar por score
        comparisons.sort(key=lambda x: x["score"], reverse=True)
        
        # Gerar comparação final
        if len(comparisons) > 1:
            comparison_summary = await self._generate_comparison_summary(
                comparisons, criteria
            )
        else:
            comparison_summary = "Insuficiente dados para comparação."
        
        return {
            "comparisons": comparisons,
            "summary": comparison_summary,
            "best_destination": comparisons[0]["destination"] if comparisons else None,
            "total_compared": len(comparisons)
        }
    
    async def _generate_comparison_summary(
        self, 
        comparisons: List[Dict[str, Any]], 
        criteria: Optional[List[str]]
    ) -> str:
        """Gera resumo comparativo"""
        try:
            comparison_text = "\n\n".join([
                f"{comp['destination']}: Score {comp['score']:.2f}\n{comp['recommendation']['answer'][:200]}..."
                for comp in comparisons[:3]
            ])
            
            criteria_text = f"\nCritérios: {', '.join(criteria) if criteria else 'Gerais'}"
            
            messages = [
                GeminiMessage(
                    role="system",
                    content="Analise as comparações de destinos e forneça um resumo objetivo.",
                ),
                GeminiMessage(
                    role="user",
                    content=f"""Comparações de destinos:
{comparison_text}
{criteria_text}

Por favor, forneça um resumo comparativo destacando prós e contras de cada destino.""",
                ),
            ]

            response = await self.llm.generate_text(messages, temperature=0.3, max_tokens=800)
            return response.content or "Não foi possível gerar resumo comparativo."
            
        except Exception as e:
            self.logger.error(f"Error generating comparison summary: {str(e)}")
            return "Não foi possível gerar resumo comparativo."
    
    async def health_check(self) -> Dict[str, Any]:
        """Verifica saúde do serviço unificado"""
        try:
            # Health checks individuais
            rag_health = await rag_integration_service.health_check()
            xai_health = await xai_integration_service.health_check()
            tiny_aya_health = self.tiny_aya.health_check()
            
            # Status geral
            all_healthy = all([
                rag_health["status"] == "healthy",
                xai_health["status"] == "healthy",
                tiny_aya_health["status"] == "healthy"
            ])
            
            return {
                "status": "healthy" if all_healthy else "degraded",
                "services": {
                    "rag": rag_health,
                    "xai": xai_health,
                    "tiny_aya": tiny_aya_health
                },
                "capabilities": [
                    "unified_ai_processing",
                    "travel_recommendations",
                    "destination_comparison",
                    "contextual_answers",
                    "explanations",
                    "alternatives"
                ],
                "integration_status": {
                    "rag_xai_integration": True,
                    "tiny_aya_integration": True,
                    "context_enhancement": True
                }
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "services": {},
                "capabilities": []
            }

# Instância global
unified_ai_service = UnifiedAIService()
