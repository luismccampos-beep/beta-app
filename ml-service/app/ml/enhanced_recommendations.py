"""
Enhanced Recommendations Service
Serviço que integra as recomendações tradicionais com TinyAya e RAG
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from pydantic import BaseModel
import numpy as np
from datetime import datetime

from app.models.predictor import Predictor
from app.pipelines.analytics import load as load_analytics, panorama, priorities, user_affinity, cross_suggestions
from app.core.config import settings
from app.core.logger import logger
from app.models.gemini_connector import GeminiConnector, GeminiMessage
from app.ml.rag_integration import rag_integration_service, RAGQueryRequest
from app.ml.unified_ai_service import unified_ai_service, UnifiedAIRequest

class EnhancedRecommendation(BaseModel):
    """Modelo para recomendação melhorada"""
    id: str
    title: str
    description: str
    score: float
    category: str
    confidence: float
    method: str  # traditional, ai_enhanced, rag, unified
    sources: Optional[List[Dict[str, Any]]] = None
    explanation: Optional[str] = None
    ai_insights: Optional[str] = None
    metadata: Dict[str, Any]

class RecommendationRequest(BaseModel):
    """Request para recomendação melhorada"""
    user_id: int
    limit: int = 10
    category: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    use_ai: bool = True
    use_rag: bool = False
    include_explanations: bool = False
    enhancement_level: str = "medium"  # low, medium, high

class RecommendationComparison(BaseModel):
    """Modelo para comparação de recomendações"""
    original: List[EnhancedRecommendation]
    enhanced: List[EnhancedRecommendation]
    improvement_metrics: Dict[str, float]
    summary: str

class EnhancedRecommendationsService:
    """Serviço de recomendações melhoradas"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.llm = GeminiConnector()
        self.predictor = Predictor()
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
    
    async def get_recommendations(
        self, 
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Obtém recomendações melhoradas"""
        try:
            # 1. Obter recomendações tradicionais
            traditional_recs = await self._get_traditional_recommendations(request)
            
            if not request.use_ai:
                return traditional_recs
            
            # 2. Melhorar com base no nível de enhancement
            if request.enhancement_level == "low":
                return await self._light_enhancement(traditional_recs, request)
            elif request.enhancement_level == "medium":
                return await self._medium_enhancement(traditional_recs, request)
            else:  # high
                return await self._heavy_enhancement(traditional_recs, request)
                
        except Exception as e:
            self.logger.error(f"Error getting enhanced recommendations: {str(e)}")
            raise
    
    async def _get_traditional_recommendations(
        self, 
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Obtém recomendações tradicionais"""
        try:
            # Usar predictor existente
            result = self.predictor.predict(
                model_name="recommender", 
                input_data={"user_id": request.user_id, "limit": request.limit}
            )
            
            recommendations = result if isinstance(result, list) else result.get("items", [])
            
            # Converter para EnhancedRecommendation
            enhanced_recs = []
            for i, rec in enumerate(recommendations[:request.limit]):
                enhanced_rec = EnhancedRecommendation(
                    id=rec.get("id", f"rec_{i}"),
                    title=rec.get("title", f"Recomendação {i+1}"),
                    description=rec.get("description", ""),
                    score=rec.get("score", 0.0),
                    category=rec.get("category", "general"),
                    confidence=0.7,  # Base confidence para tradicionais
                    method="traditional",
                    metadata={
                        "rank": i + 1,
                        "original_data": rec
                    }
                )
                enhanced_recs.append(enhanced_rec)
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error getting traditional recommendations: {str(e)}")
            return []
    
    async def _light_enhancement(
        self, 
        recommendations: List[EnhancedRecommendation],
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Enhancement leve com TinyAya"""
        try:
            # Obter perfil do usuário
            user_profile = await self._get_user_profile(request.user_id)
            
            enhanced_recs = []
            for rec in recommendations:
                # Análise simples com TinyAya
                analysis = await self._analyze_recommendation_light(rec, user_profile, request)
                
                enhanced_rec = rec.copy()
                enhanced_rec.ai_insights = analysis["insights"]
                enhanced_rec.confidence = min(1.0, rec.confidence + 0.1)
                enhanced_rec.method = "ai_enhanced_light"
                enhanced_rec.metadata.update({
                    "enhancement_level": "light",
                    "analysis": analysis
                })
                
                enhanced_recs.append(enhanced_rec)
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error in light enhancement: {str(e)}")
            return recommendations
    
    async def _medium_enhancement(
        self, 
        recommendations: List[EnhancedRecommendation],
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Enhancement médio com TinyAya e contexto"""
        try:
            # Obter perfil e contexto completo
            user_profile = await self._get_user_profile(request.user_id)
            
            # Construir prompt para análise detalhada
            recs_text = "\n".join([
                f"{i+1}. {rec.title} (score: {rec.score:.2f}, categoria: {rec.category})\n{rec.description[:200]}..."
                for i, rec in enumerate(recommendations[:5])
            ])
            
            context_text = f"""
            Perfil do usuário {request.user_id}:
            - Preferências: {request.preferences or {}}
            - Contexto: {request.context or {}}
            - Perfil analítico: {user_profile}
            
            Recomendações a analisar:
            {recs_text}
            """
            
            messages = [
                GeminiMessage(
                    role="system",
                    content="Você é um especialista em recomendações de viagem. Analise as recomendações fornecidas e melhore-as com base no perfil do usuário. Forneça insights específicos para cada recomendação."
                ),
                GeminiMessage(
                    role="user",
                    content=f"""Analise estas recomendações e forneça insights para cada uma:
{context_text}

Para cada recomendação, indique:
1. Relevância para o usuário (1-10)
2. Pontos fortes
3. Possíveis limitações
4. Sugestões de melhoria"""
                )
            ]
            
            response = await self.llm.generate_text(messages, max_tokens=1000)
            
            # Processar resposta e aplicar melhorias
            enhanced_recs = await self._process_medium_enhancement_response(
                recommendations, response.content, request
            )
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error in medium enhancement: {str(e)}")
            return recommendations
    
    async def _heavy_enhancement(
        self, 
        recommendations: List[EnhancedRecommendation],
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Enhancement pesado com RAG e XAI"""
        try:
            # Usar RAG para enriquecer recomendações
            if request.use_rag:
                rag_enhanced_recs = await self._rag_enhancement(recommendations, request)
            else:
                rag_enhanced_recs = recommendations
            
            # Usar serviço unificado para análise XAI
            unified_enhanced_recs = await self._unified_enhancement(rag_enhanced_recs, request)
            
            return unified_enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error in heavy enhancement: {str(e)}")
            return recommendations
    
    async def _rag_enhancement(
        self, 
        recommendations: List[EnhancedRecommendation],
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Enhancement com RAG"""
        try:
            # Construir query para RAG
            rec_titles = ", ".join([rec.title for rec in recommendations[:3]])
            query = f"Análise de recomendações de viagem: {rec_titles}"
            
            rag_request = RAGQueryRequest(
                query=query,
                max_results=5,
                user_preferences=request.preferences or {},
                categories=[request.category] if request.category else None
            )
            
            rag_response = await rag_integration_service.generate_answer_with_rag(rag_request)
            
            # Aplicar insights RAG às recomendações
            enhanced_recs = []
            for i, rec in enumerate(recommendations):
                enhanced_rec = rec.copy()
                enhanced_rec.sources = rag_response.sources
                enhanced_rec.explanation = rag_response.explanation
                enhanced_rec.confidence = min(1.0, rec.confidence + 0.2)
                enhanced_rec.method = "rag_enhanced"
                enhanced_rec.metadata.update({
                    "rag_response": rag_response.dict(),
                    "enhancement_level": "heavy"
                })
                
                enhanced_recs.append(enhanced_rec)
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error in RAG enhancement: {str(e)}")
            return recommendations
    
    async def _unified_enhancement(
        self, 
        recommendations: List[EnhancedRecommendation],
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Enhancement com serviço unificado"""
        try:
            # Construir query para serviço unificado
            rec_descriptions = "\n".join([
                f"{i+1}. {rec.title}: {rec.description[:100]}..."
                for i, rec in enumerate(recommendations[:3])
            ])
            
            query = f"""
            Analise e melhore estas recomendações:
            {rec_descriptions}
            
            Perfil do usuário: {request.user_id}
            Preferências: {request.preferences}
            Contexto: {request.context}
            """
            
            unified_request = UnifiedAIRequest(
                query=query,
                context={
                    "user_id": request.user_id,
                    "recommendations": [rec.dict() for rec in recommendations],
                    **(request.context or {})
                },
                user_preferences=request.preferences or {},
                include_explanation=True,
                include_alternatives=True,
                language="pt"
            )
            
            unified_response = await unified_ai_service.process_request(unified_request)
            
            # Processar resposta unificada
            enhanced_recs = await self._process_unified_enhancement_response(
                recommendations, unified_response, request
            )
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error in unified enhancement: {str(e)}")
            return recommendations
    
    async def _analyze_recommendation_light(
        self, 
        rec: EnhancedRecommendation, 
        user_profile: Dict[str, Any],
        request: RecommendationRequest
    ) -> Dict[str, Any]:
        """Análise leve de recomendação"""
        try:
            messages = [
                GeminiMessage(
                    role="system",
                    content="Analise brevemente uma recomendação e forneça insights em uma frase."
                ),
                GeminiMessage(
                    role="user",
                    content=f"""Recomendação: {rec.title}
                    Score: {rec.score}
                    Categoria: {rec.category}
                    Perfil: {user_profile}
                    
                    Forneça insights em uma frase."""
                )
            ]
            
            response = await self.llm.generate_text(messages, max_tokens=100)
            
            return {
                "insights": response.content,
                "relevance_score": rec.score,
                "analysis": response.content
            }
            
        except Exception as e:
            self.logger.error(f"Error in light analysis: {str(e)}")
            return {"insights": "Análise não disponível"}
    
    async def _process_medium_enhancement_response(
        self, 
        recommendations: List[EnhancedRecommendation],
        ai_response: str,
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Processa resposta de enhancement médio"""
        try:
            # Parse simplificado da resposta da IA
            lines = ai_response.split('\n')
            
            enhanced_recs = []
            for i, rec in enumerate(recommendations[:len(lines)]):
                enhanced_rec = rec.copy()
                
                # Extrair insights relevantes
                if i < len(lines):
                    line = lines[i]
                    enhanced_rec.ai_insights = line.strip()
                    
                    # Ajustar score com base na análise
                    if "alta relevância" in line.lower() or "excelente" in line.lower():
                        enhanced_rec.score = min(1.0, rec.score * 1.2)
                    elif "baixa relevância" in line.lower() or "fraca" in line.lower():
                        enhanced_rec.score = max(0.0, rec.score * 0.8)
                
                    enhanced_rec.confidence = min(1.0, rec.confidence + 0.15)
                
                enhanced_rec.method = "ai_enhanced_medium"
                enhanced_rec.metadata.update({
                    "enhancement_level": "medium",
                    "ai_analysis": lines[i] if i < len(lines) else None
                })
                
                enhanced_recs.append(enhanced_rec)
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error processing medium enhancement: {str(e)}")
            return recommendations
    
    async def _process_unified_enhancement_response(
        self, 
        recommendations: List[EnhancedRecommendation],
        unified_response,
        request: RecommendationRequest
    ) -> List[EnhancedRecommendation]:
        """Processa resposta unificada"""
        try:
            enhanced_recs = []
            
            for i, rec in enumerate(recommendations):
                enhanced_rec = rec.copy()
                
                # Aplicar insights da resposta unificada
                if unified_response.explanation:
                    enhanced_rec.explanation = unified_response.explanation.explanation["why"]
                    enhanced_rec.sources = unified_response.sources
                
                enhanced_rec.confidence = unified_response.confidence
                enhanced_rec.method = "unified_enhanced"
                enhanced_rec.metadata.update({
                    "enhancement_level": "heavy",
                    "unified_response_id": unified_response.request_id,
                    "processing_time": unified_response.processing_time
                })
                
                enhanced_recs.append(enhanced_rec)
            
            return enhanced_recs
            
        except Exception as e:
            self.logger.error(f"Error processing unified enhancement: {str(e)}")
            return recommendations
    
    async def _get_user_profile(self, user_id: int) -> Dict[str, Any]:
        """Obtém perfil analítico do usuário"""
        try:
            inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
            return user_affinity(inter, items, user_id)
        except Exception as e:
            self.logger.error(f"Error getting user profile: {str(e)}")
            return {}
    
    async def compare_recommendations(
        self, 
        user_id: int,
        limit: int = 10
    ) -> RecommendationComparison:
        """Compara recomendações tradicionais vs melhoradas"""
        try:
            # Obter ambas versões
            traditional_request = RecommendationRequest(
                user_id=user_id,
                limit=limit,
                use_ai=False
            )
            
            enhanced_request = RecommendationRequest(
                user_id=user_id,
                limit=limit,
                use_ai=True,
                enhancement_level="medium"
            )
            
            traditional_recs = await self.get_recommendations(traditional_request)
            enhanced_recs = await self.get_recommendations(enhanced_request)
            
            # Calcular métricas de melhoria
            improvement_metrics = self._calculate_improvement_metrics(
                traditional_recs, enhanced_recs
            )
            
            # Gerar resumo
            summary = await self._generate_comparison_summary(
                traditional_recs, enhanced_recs, improvement_metrics
            )
            
            return RecommendationComparison(
                original=traditional_recs,
                enhanced=enhanced_recs,
                improvement_metrics=improvement_metrics,
                summary=summary
            )
            
        except Exception as e:
            self.logger.error(f"Error comparing recommendations: {str(e)}")
            raise
    
    def _calculate_improvement_metrics(
        self, 
        traditional: List[EnhancedRecommendation],
        enhanced: List[EnhancedRecommendation]
    ) -> Dict[str, float]:
        """Calcula métricas de melhoria"""
        if not traditional or not enhanced:
            return {}
        
        # Métricas básicas
        avg_score_traditional = np.mean([rec.score for rec in traditional])
        avg_score_enhanced = np.mean([rec.score for rec in enhanced])
        
        avg_confidence_traditional = np.mean([rec.confidence for rec in traditional])
        avg_confidence_enhanced = np.mean([rec.confidence for rec in enhanced])
        
        return {
            "avg_score_improvement": avg_score_enhanced - avg_score_traditional,
            "avg_confidence_improvement": avg_confidence_enhanced - avg_confidence_traditional,
            "score_improvement_percentage": ((avg_score_enhanced - avg_score_traditional) / avg_score_traditional * 100) if avg_score_traditional > 0 else 0,
            "confidence_improvement_percentage": ((avg_confidence_enhanced - avg_confidence_traditional) / avg_confidence_traditional * 100) if avg_confidence_traditional > 0 else 0
        }
    
    async def _generate_comparison_summary(
        self, 
        traditional: List[EnhancedRecommendation],
        enhanced: List[EnhancedRecommendation],
        metrics: Dict[str, float]
    ) -> str:
        """Gera resumo comparativo"""
        try:
            messages = [
                GeminiMessage(
                    role="system",
                    content="Analise a comparação entre recomendações tradicionais e melhoradas. Forneça um resumo conciso das melhorias."
                ),
                GeminiMessage(
                    role="user",
                    content=f"""
                    Métricas de melhoria:
                    - Melhoria no score: {metrics.get('score_improvement_percentage', 0):.2f}%
                    - Melhoria na confiança: {metrics.get('confidence_improvement_percentage', 0):.2f}%
                    
                    Top 3 tradicionais: {[rec.title for rec in traditional[:3]]}
                    Top 3 melhoradas: {[rec.title for rec in enhanced[:3]]}
                    
                    Forneça um resumo das melhorias alcançadas."""
                )
            ]
            
            response = await self.llm.generate_text(messages, max_tokens=300)
            
            return response.content
            
        except Exception as e:
            self.logger.error(f"Error generating comparison summary: {str(e)}")
            return f"Melhoria no score: {metrics.get('score_improvement_percentage', 0):.2f}%"

# Instância global
enhanced_recommendations_service = EnhancedRecommendationsService()
