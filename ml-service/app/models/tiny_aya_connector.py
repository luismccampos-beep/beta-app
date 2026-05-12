"""
TinyAya LLM Connector
Conector para o modelo TinyAya local para geração de texto e RAG
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional, Union
from pydantic import BaseModel
import requests
import numpy as np

from app.core.config import settings
from app.core.logger import logger

class TinyAyaConfig(BaseModel):
    """Configuração do TinyAya"""
    model_path: str = "models/tiny_aya"
    api_url: str = "http://localhost:8080/v1"
    api_key: Optional[str] = None
    max_tokens: int = 2048
    temperature: float = 0.7
    top_p: float = 0.9
    context_window: int = 4096
    
class TinyAyaMessage(BaseModel):
    """Mensagem para o TinyAya"""
    role: str  # system, user, assistant
    content: str
    
class TinyAyaResponse(BaseModel):
    """Resposta do TinyAya"""
    content: str
    finish_reason: str
    usage: Dict[str, int]
    model: str
    
class TinyAyaConnector:
    """Conector principal para TinyAya"""
    
    def __init__(self, config: Optional[TinyAyaConfig] = None):
        if config is not None:
            self.config = config
        else:
            self.config = TinyAyaConfig(
                api_url=getattr(settings, "TINY_AYA_API_URL", "http://localhost:8080/v1"),
                api_key=getattr(settings, "TINY_AYA_API_KEY", None),
            )
        self.logger = logging.getLogger(__name__)
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
    
    async def generate_text(
        self, 
        messages: List[TinyAyaMessage],
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> TinyAyaResponse:
        """Gera texto usando TinyAya"""
        try:
            payload = {
                "model": "tiny_aya",
                "messages": [{"role": msg.role, "content": msg.content} for msg in messages],
                "max_tokens": max_tokens or self.config.max_tokens,
                "temperature": temperature or self.config.temperature,
                "top_p": self.config.top_p,
                "stream": False,
                **kwargs
            }
            
            headers = {
                "Content-Type": "application/json",
            }
            
            if self.config.api_key:
                headers["Authorization"] = f"Bearer {self.config.api_key}"
            
            self.logger.info(f"Sending request to TinyAya: {self.config.api_url}/chat/completions")
            
            response = requests.post(
                f"{self.config.api_url}/chat/completions",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code != 200:
                self.logger.error(f"TinyAya API error: {response.status_code} - {response.text}")
                raise Exception(f"TinyAya API error: {response.status_code}")
            
            data = response.json()
            
            return TinyAyaResponse(
                content=data["choices"][0]["message"]["content"],
                finish_reason=data["choices"][0]["finish_reason"],
                usage=data.get("usage", {}),
                model=data.get("model", "tiny_aya")
            )
            
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request error: {str(e)}")
            raise Exception(f"Failed to connect to TinyAya: {str(e)}")
        except Exception as e:
            self.logger.error(f"Generation error: {str(e)}")
            raise
    
    async def generate_with_rag(
        self,
        query: str,
        context: List[Dict[str, Any]],
        max_context_length: int = 3000
    ) -> TinyAyaResponse:
        """Gera resposta com contexto RAG"""
        
        # Formatar contexto
        context_text = self._format_context(context, max_context_length)
        
        # Criar mensagens com RAG
        messages = [
            TinyAyaMessage(
                role="system",
                content="""Você é um assistente de viagem especializado da AKMLEVA.
Use apenas o contexto fornecido para responder as perguntas.
Se a informação não estiver no contexto, diga que não sabe.
Sempre cite as fontes usadas na resposta.
Responda em português de forma clara e objetiva."""
            ),
            TinyAyaMessage(
                role="user",
                content=f"""Contexto relevante:
{context_text}

Pergunta: {query}

Por favor, responda baseado apenas no contexto fornecido."""
            )
        ]
        
        return await self.generate_text(messages, temperature=0.3)
    
    def _format_context(self, context: List[Dict[str, Any]], max_length: int) -> str:
        """Formata contexto para o LLM"""
        formatted_docs = []
        current_length = 0
        
        for doc in context:
            doc_text = f"""
Fonte: {doc.get('title', 'Sem título')}
Categoria: {doc.get('category', 'Geral')}
Confiabilidade: {doc.get('trust_score', 0):.2f}
Conteúdo: {doc.get('content', '')[:500]}...
URL: {doc.get('url', 'Não disponível')}
---
"""
            
            if current_length + len(doc_text) > max_length:
                break
                
            formatted_docs.append(doc_text)
            current_length += len(doc_text)
        
        return "\n".join(formatted_docs)
    
    async def generate_explanation(
        self,
        recommendation: str,
        factors: List[Dict[str, Any]],
        user_context: Dict[str, Any]
    ) -> TinyAyaResponse:
        """Gera explicação para recomendação (XAI)"""
        
        factors_text = "\n".join([
            f"- {factor.get('name', '')}: {factor.get('value', '')} (peso: {factor.get('weight', 0)})"
            for factor in factors
        ])
        
        user_context_text = "\n".join([
            f"- {key}: {value}" for key, value in user_context.items()
        ])
        
        messages = [
            TinyAyaMessage(
                role="system",
                content="""Você é um especialista em explicar recomendações de viagem.
Forneça explicações claras, transparentes e honestas.
Explique o porquê das recomendações e quais fatores foram mais importantes.
Mencione limitações quando houver."""
            ),
            TinyAyaMessage(
                role="user",
                content=f"""Recomendação: {recommendation}

Fatores considerados:
{factors_text}

Contexto do usuário:
{user_context_text}

Por favor, explique esta recomendação de forma clara e transparente."""
            )
        ]
        
        return await self.generate_text(messages, temperature=0.4, max_tokens=1000)
    
    async def generate_factual_check(
        self,
        claim: str,
        context: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Verifica factualidade de uma afirmação"""
        
        context_text = self._format_context(context, 2000)
        
        messages = [
            TinyAyaMessage(
                role="system",
                content="""Você é um verificador de fatos especializado em viagens.
Analise a afirmação e o contexto fornecido.
Retorne um JSON com: verified (boolean), confidence (0-1), explanation, sources."""
            ),
            TinyAyaMessage(
                role="user",
                content=f"""Afirmação: {claim}

Contexto:
{context_text}

Verifique se esta afirmação é factualmente correta baseada no contexto."""
            )
        ]
        
        try:
            response = await self.generate_text(messages, temperature=0.1)
            
            # Tentar parse do JSON
            try:
                result = json.loads(response.content)
                return result
            except json.JSONDecodeError:
                # Fallback se não conseguir parsear JSON
                return {
                    "verified": False,
                    "confidence": 0.5,
                    "explanation": "Não foi possível verificar a afirmação",
                    "sources": []
                }
        except Exception as e:
            self.logger.error(f"Factual check error: {str(e)}")
            return {
                "verified": False,
                "confidence": 0.0,
                "explanation": f"Erro na verificação: {str(e)}",
                "sources": []
            }
    
    def health_check(self) -> Dict[str, Any]:
        """Verifica saúde do conector"""
        try:
            # Testar conexão básica
            response = requests.get(f"{self.config.api_url}/health", timeout=5)
            
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "api_url": self.config.api_url,
                "model": "tiny_aya",
                "response_time_ms": response.elapsed.total_seconds() * 1000 if hasattr(response, 'elapsed') else None
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "api_url": self.config.api_url,
                "model": "tiny_aya"
            }

# Instância global do conector
tiny_aya_connector = TinyAyaConnector()
