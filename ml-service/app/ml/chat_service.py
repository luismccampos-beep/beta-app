"""
Chat Service
Serviço de chat conversacional integrado com TinyAya, RAG e XAI
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from pydantic import BaseModel
import uuid
from datetime import datetime, timedelta
import json

from app.core.config import settings
from app.core.logger import logger
from app.models.gemini_connector import GeminiConnector, GeminiMessage
from app.ml.unified_ai_service import unified_ai_service, UnifiedAIRequest
from app.ml.rag_integration import rag_integration_service, RAGQueryRequest

class ChatMessage(BaseModel):
    """Mensagem do chat"""
    id: str
    role: str  # user, assistant, system
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ChatSession(BaseModel):
    """Sessão de chat"""
    id: str
    user_id: int
    messages: List[ChatMessage]
    context: Dict[str, Any]
    created_at: datetime
    last_activity: datetime
    preferences: Dict[str, Any]

class ChatRequest(BaseModel):
    """Request para chat"""
    user_id: int
    message: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    use_rag: bool = True
    include_explanations: bool = False
    language: str = "pt"

class ChatResponse(BaseModel):
    """Response do chat"""
    success: bool
    session_id: str
    message_id: str
    response: str
    sources: Optional[List[Dict[str, Any]]] = None
    explanation: Optional[str] = None
    confidence: Optional[float] = None
    processing_time: float
    suggestions: List[str] = []
    is_travel_related: bool

class ChatService:
    """Serviço principal de chat"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.llm = GeminiConnector()
        self.sessions: Dict[str, ChatSession] = {}
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
    
    async def process_message(self, request: ChatRequest) -> ChatResponse:
        """Processa mensagem do chat"""
        import time
        start_time = time.time()
        
        try:
            # Obter ou criar sessão
            session = await self._get_or_create_session(request)
            
            # Adicionar mensagem do usuário à sessão
            user_message = ChatMessage(
                id=str(uuid.uuid4()),
                role="user",
                content=request.message,
                timestamp=datetime.now(),
                metadata={"session_id": session.id}
            )
            session.messages.append(user_message)
            
            # Detectar se é relacionado a viagens
            is_travel_related = self._is_travel_related(request.message)
            
            # Gerar resposta
            if is_travel_related and request.use_rag:
                response_data = await self._generate_travel_response(request, session)
            else:
                response_data = await self._generate_general_response(request, session)
            
            # Adicionar resposta à sessão
            assistant_message = ChatMessage(
                id=str(uuid.uuid4()),
                role="assistant",
                content=response_data["response"],
                timestamp=datetime.now(),
                metadata={
                    "sources": response_data.get("sources"),
                    "confidence": response_data.get("confidence"),
                    "method": response_data.get("method", "general")
                }
            )
            session.messages.append(assistant_message)
            
            # Atualizar atividade da sessão
            session.last_activity = datetime.now()
            
            # Gerar sugestões
            suggestions = await self._generate_suggestions(request.message, session)
            
            return ChatResponse(
                success=True,
                session_id=session.id,
                message_id=assistant_message.id,
                response=response_data["response"],
                sources=response_data.get("sources"),
                explanation=response_data.get("explanation"),
                confidence=response_data.get("confidence"),
                processing_time=time.time() - start_time,
                suggestions=suggestions,
                is_travel_related=is_travel_related
            )
            
        except Exception as e:
            self.logger.error(f"Error processing chat message: {str(e)}")
            raise
    
    async def _get_or_create_session(self, request: ChatRequest) -> ChatSession:
        """Obtém sessão existente ou cria nova"""
        if request.session_id and request.session_id in self.sessions:
            session = self.sessions[request.session_id]
            
            # Atualizar contexto se fornecido
            if request.context:
                session.context.update(request.context)
            
            return session
        
        # Criar nova sessão
        session_id = str(uuid.uuid4())
        session = ChatSession(
            id=session_id,
            user_id=request.user_id,
            messages=[],
            context=request.context or {},
            created_at=datetime.now(),
            last_activity=datetime.now(),
            preferences=request.preferences or {}
        )
        
        self.sessions[session_id] = session
        return session
    
    def _is_travel_related(self, message: str) -> bool:
        """Detecta se a mensagem é relacionada a viagens"""
        travel_keywords = [
            "viagem", "viajar", "destino", "hotel", "voo", "pacote", "rota",
            "aluguer", "carro", "transporte", "turismo", "ferias", "férias",
            "lisboa", "porto", "algarve", "madeira", "portugal", "europa",
            "passagem", "hospedagem", "reserva", "check-in", "malas"
        ]
        
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in travel_keywords)
    
    async def _generate_travel_response(
        self, 
        request: ChatRequest, 
        session: ChatSession
    ) -> Dict[str, Any]:
        """Gera resposta relacionada a viagens usando RAG"""
        try:
            # Construir contexto enriquecido
            enriched_context = {
                "user_id": request.user_id,
                "session_history": [
                    {"role": msg.role, "content": msg.content}
                    for msg in session.messages[-5:]  # Últimas 5 mensagens
                ],
                "user_preferences": session.preferences,
                **session.context
            }
            
            # Usar serviço unificado para viagens
            unified_request = UnifiedAIRequest(
                query=request.message,
                context=enriched_context,
                user_preferences=session.preferences,
                include_explanation=request.include_explanations,
                include_alternatives=True,
                max_sources=8,
                language=request.language
            )
            
            ai_response = await unified_ai_service.process_request(unified_request)
            
            return {
                "response": ai_response.answer,
                "sources": [source.dict() for source in ai_response.sources],
                "explanation": ai_response.explanation.explanation["why"] if ai_response.explanation else None,
                "confidence": ai_response.confidence,
                "method": "unified_travel_ai"
            }
            
        except Exception as e:
            self.logger.error(f"Error generating travel response: {str(e)}")
            # Fallback para TinyAya direto
            return await self._generate_fallback_response(request, session)
    
    async def _generate_general_response(
        self, 
        request: ChatRequest, 
        session: ChatSession
    ) -> Dict[str, Any]:
        """Gera resposta geral usando TinyAya"""
        try:
            # Construir contexto do chat
            context_text = "\n".join([
                f"User ID: {request.user_id}",
                f"Preferências: {session.preferences}",
                f"Contexto: {session.context}",
                "Histórico recente:"
            ])
            
            for msg in session.messages[-3:]:  # Últimas 3 mensagens
                context_text += f"\n{msg.role}: {msg.content}"
            
            messages = [
                GeminiMessage(
                    role="system",
                    content=f"""Você é um assistente virtual amigável e prestativo da AKMLEVA.
Especialista em viagens e turismo, mas pode ajudar com outros assuntos.
Use o contexto fornecido para personalizar suas respostas.
Responda em {request.language} a menos que solicitado outro idioma.
Seja útil, claro e conciso.""",
                ),
                GeminiMessage(
                    role="user",
                    content=f"""Contexto da conversação:
{context_text}

Nova mensagem: {request.message}""",
                ),
            ]

            response = await self.llm.generate_text(messages, temperature=0.7, max_tokens=800)
            
            return {
                "response": response.content,
                "method": "gemini_general"
            }
            
        except Exception as e:
            self.logger.error(f"Error generating general response: {str(e)}")
            return await self._generate_fallback_response(request, session)
    
    async def _generate_fallback_response(
        self, 
        request: ChatRequest, 
        session: ChatSession
    ) -> Dict[str, Any]:
        """Gera resposta de fallback em caso de erro"""
        fallback_responses = [
            "Peço desculpas, estou com dificuldades para processar sua solicitação. Poderia reformular?",
            "No momento não consigo fornecer uma resposta adequada. Tente novamente em alguns instantes.",
            "Ocorreu um erro inesperado. Por favor, entre em contato com nosso suporte se o problema persistir."
        ]
        
        import random
        response_text = random.choice(fallback_responses)
        
        return {
            "response": response_text,
            "method": "fallback",
            "confidence": 0.1
        }
    
    async def _generate_suggestions(
        self, 
        message: str, 
        session: ChatSession
    ) -> List[str]:
        """Gera sugestões de follow-up"""
        try:
            # Sugestões baseadas no contexto da conversa
            suggestions = [
                "Pode me ajudar a planejar uma viagem?",
                "Quais são os melhores destinos em Portugal?",
                "Como encontrar hotéis com bom custo-benefício?",
                "Preciso de ajuda com reservas de voo?",
                "Qual a melhor época para visitar o Algarve?"
            ]
            
            # Se a última mensagem foi sobre um destino específico
            if any(dest in message.lower() for dest in ["lisboa", "porto", "algarve", "faro"]):
                destination = next(
                    (dest for dest in ["Lisboa", "Porto", "Algarve", "Faro"] 
                    if dest.lower() in message.lower()
                ), None
                )
                
                if destination:
                    suggestions = [
                        f"O que fazer em {destination}?",
                        f"Quanto custa viajar para {destination}?",
                        f"Qual a melhor época para visitar {destination}?",
                        f"Hotéis recomendados em {destination}?",
                        f"Como chegar a {destination}?"
                    ]
            
            # Limitar a 3 sugestões
            return suggestions[:3]
            
        except Exception as e:
            self.logger.error(f"Error generating suggestions: {str(e)}")
            return []
    
    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Obtém sessão por ID"""
        return self.sessions.get(session_id)
    
    async def get_user_sessions(self, user_id: int) -> List[ChatSession]:
        """Obtém todas as sessões de um usuário"""
        return [
            session for session in self.sessions.values()
            if session.user_id == user_id
        ]
    
    async def delete_session(self, session_id: str) -> bool:
        """Deleta sessão"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    async def clear_old_sessions(self, max_age_hours: int = 24) -> int:
        """Limpa sessões antigas"""
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
        
        old_sessions = [
            session_id for session_id, session in self.sessions.items()
            if session.last_activity < cutoff_time
        ]
        
        for session_id in old_sessions:
            del self.sessions[session_id]
        
        return len(old_sessions)
    
    async def get_chat_stats(self) -> Dict[str, Any]:
        """Obtém estatísticas do chat"""
        total_sessions = len(self.sessions)
        total_messages = sum(len(session.messages) for session in self.sessions.values())
        
        # Mensagens por tipo
        user_messages = sum(
            1 for session in self.sessions.values()
            for msg in session.messages
            if msg.role == "user"
        )
        
        assistant_messages = total_messages - user_messages
        
        # Sessões ativas recentemente
        recent_cutoff = datetime.now() - timedelta(hours=1)
        active_sessions = sum(
            1 for session in self.sessions.values()
            if session.last_activity > recent_cutoff
        )
        
        return {
            "total_sessions": total_sessions,
            "total_messages": total_messages,
            "user_messages": user_messages,
            "assistant_messages": assistant_messages,
            "active_sessions_last_hour": active_sessions,
            "avg_messages_per_session": total_messages / total_sessions if total_sessions > 0 else 0
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Verifica saúde do serviço de chat"""
        try:
            # TinyAya removed; Gemini is used
            tiny_aya_health = {"status": "disabled", "note": "TinyAya removed; GeminiConnector is used."}
            gemini_health = {
                "status": "configured" if getattr(settings, "GEMINI_API_KEY", None) else "missing_key",
                "model": getattr(settings, "GEMINI_MODEL", "gemini-2.0-flash"),
            }
            
            # Testar serviços integrados
            rag_health = await rag_integration_service.health_check()
            unified_health = await unified_ai_service.health_check()
            
            # Status geral
            all_healthy = all([
                gemini_health.get("status") == "configured",
                rag_health.get("status") in ["healthy", "degraded"],
                unified_health.get("status") in ["healthy", "degraded"]
            ])
            
            return {
                "status": "healthy" if all_healthy else "degraded",
                "services": {
                    "tiny_aya": tiny_aya_health,
                    "gemini": gemini_health,
                    "rag": rag_health,
                    "unified_ai": unified_health
                },
                "sessions": {
                    "total": len(self.sessions),
                    "active": len([
                        s for s in self.sessions.values()
                        if s.last_activity > datetime.now() - timedelta(hours=1)
                    ])
                },
                "capabilities": [
                    "travel_recommendations",
                    "general_assistance",
                    "contextual_conversations",
                    "rag_enhanced_responses",
                    "multi_language_support"
                ]
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "sessions": {"total": len(self.sessions)},
                "capabilities": []
            }

# Instância global
chat_service = ChatService()
