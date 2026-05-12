"""
TinyAya Configuration
Configurações para o modelo TinyAya local
"""

import os
from typing import Dict, Any, Optional
from pydantic import BaseModel

class TinyAyaModelConfig(BaseModel):
    """Configuração do modelo TinyAya"""
    model_name: str = "tiny_aya"
    model_path: str = "models/tiny_aya"
    api_url: str = "http://localhost:8080/v1"
    api_key: Optional[str] = None
    
    # Parâmetros do modelo
    max_tokens: int = 2048
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 40
    repetition_penalty: float = 1.1
    
    # Contexto
    context_window: int = 4096
    max_context_length: int = 3000
    
    # Performance
    batch_size: int = 1
    use_gpu: bool = False
    gpu_layers: int = 0
    n_threads: int = 4
    
    # Cache
    enable_cache: bool = True
    cache_size: int = 1000
    
    # Timeout
    request_timeout: int = 30
    health_check_timeout: int = 5

class TinyAyaPrompts(BaseModel):
    """Prompts padrão para TinyAya"""
    
    # Sistema principal
    system_prompt: str = """Você é um assistente de viagem especializado da AKMLEVA.
Forneça informações precisas, úteis e baseadas em fontes confiáveis.
Seja claro, conciso e sempre cite suas fontes quando possível.
Responda em português a menos que solicitado outro idioma."""

    # RAG específico
    rag_system_prompt: str = """Você é um assistente de viagem especialista da AKMLEVA.
Use APENAS o contexto fornecido para responder.
Se a informação não estiver no contexto, diga que não sabe.
Sempre cite as fontes usadas na resposta.
Responda de forma clara e objetiva."""

    # XAI específico
    xai_system_prompt: str = """Você é um especialista em explicar recomendações de viagem.
Forneça explicações claras, transparentes e honestas.
Explique o porquê das recomendações e quais fatores foram mais importantes.
Mencione limitações quando houver."""

    # Verificação factual
    fact_check_system_prompt: str = """Você é um verificador de fatos especializado em viagens.
Analise a afirmação e o contexto fornecido.
Retorne um JSON com: verified (boolean), confidence (0-1), explanation, sources."""

    # Chat conversacional
    chat_system_prompt: str = """Você é um assistente de viagem amigável e prestativo da AKMLEVA.
Mantenha o contexto da conversa.
Seja pessoal e adaptado às preferências do usuário.
Ofereça sugestões práticas e úteis."""

class TinyAyaIntegrationConfig(BaseModel):
    """Configuração de integração TinyAya"""
    
    # Backend
    backend_url: str = "http://localhost:3001"
    backend_timeout: int = 30
    retry_attempts: int = 3
    retry_delay: float = 1.0
    
    # RAG
    rag_max_sources: int = 5
    rag_min_trust_score: float = 0.5
    rag_max_context_length: int = 3000
    
    # XAI
    xai_enable_explanations: bool = True
    xai_enable_alternatives: bool = True
    xai_max_factors: int = 10
    xai_max_alternatives: int = 3
    
    # Cache
    enable_response_cache: bool = True
    cache_ttl: int = 3600  # 1 hora
    max_cache_size: int = 1000
    
    # Logging
    enable_detailed_logging: bool = False
    log_requests: bool = True
    log_responses: bool = False

def get_tiny_aya_config() -> TinyAyaModelConfig:
    """Obtém configuração do TinyAya"""
    return TinyAyaModelConfig(
        model_name=os.getenv("TINY_AYA_MODEL_NAME", "tiny_aya"),
        model_path=os.getenv("TINY_AYA_MODEL_PATH", "models/tiny_aya"),
        api_url=os.getenv("TINY_AYA_API_URL", "http://localhost:8080/v1"),
        api_key=os.getenv("TINY_AYA_API_KEY"),
        max_tokens=int(os.getenv("TINY_AYA_MAX_TOKENS", "2048")),
        temperature=float(os.getenv("TINY_AYA_TEMPERATURE", "0.7")),
        top_p=float(os.getenv("TINY_AYA_TOP_P", "0.9")),
        context_window=int(os.getenv("TINY_AYA_CONTEXT_WINDOW", "4096")),
        use_gpu=os.getenv("TINY_AYA_USE_GPU", "false").lower() == "true",
        n_threads=int(os.getenv("TINY_AYA_N_THREADS", "4")),
        request_timeout=int(os.getenv("TINY_AYA_REQUEST_TIMEOUT", "30"))
    )

def get_tiny_aya_prompts() -> TinyAyaPrompts:
    """Obtém prompts padrão do TinyAya"""
    return TinyAyaPrompts()

def get_tiny_aya_integration_config() -> TinyAyaIntegrationConfig:
    """Obtém configuração de integração do TinyAya"""
    return TinyAyaIntegrationConfig(
        backend_url=os.getenv("BACKEND_URL", "http://localhost:3001"),
        rag_max_sources=int(os.getenv("RAG_MAX_SOURCES", "5")),
        rag_min_trust_score=float(os.getenv("RAG_MIN_TRUST_SCORE", "0.5")),
        xai_enable_explanations=os.getenv("XAI_ENABLE_EXPLANATIONS", "true").lower() == "true",
        enable_response_cache=os.getenv("ENABLE_RESPONSE_CACHE", "true").lower() == "true"
    )

def get_tiny_aya_env_vars() -> Dict[str, str]:
    """Retorna variáveis de ambiente necessárias"""
    return {
        "TINY_AYA_MODEL_NAME": "Nome do modelo TinyAya",
        "TINY_AYA_MODEL_PATH": "Caminho para o modelo TinyAya",
        "TINY_AYA_API_URL": "URL da API do TinyAya",
        "TINY_AYA_API_KEY": "Chave da API do TinyAya (opcional)",
        "TINY_AYA_MAX_TOKENS": "Tokens máximos (default: 2048)",
        "TINY_AYA_TEMPERATURE": "Temperatura (default: 0.7)",
        "TINY_AYA_TOP_P": "Top P (default: 0.9)",
        "TINY_AYA_CONTEXT_WINDOW": "Janela de contexto (default: 4096)",
        "TINY_AYA_USE_GPU": "Usar GPU (default: false)",
        "TINY_AYA_N_THREADS": "Número de threads (default: 4)",
        "TINY_AYA_REQUEST_TIMEOUT": "Timeout da requisição (default: 30)",
        "BACKEND_URL": "URL do backend AKMLEVA",
        "RAG_MAX_SOURCES": "Fontes máximas RAG (default: 5)",
        "RAG_MIN_TRUST_SCORE": "Score mínimo confiança RAG (default: 0.5)",
        "XAI_ENABLE_EXPLANATIONS": "Habilitar explicações XAI (default: true)",
        "ENABLE_RESPONSE_CACHE": "Habilitar cache de respostas (default: true)"
    }

def validate_tiny_aya_config() -> Dict[str, Any]:
    """Valida configuração do TinyAya"""
    config = get_tiny_aya_config()
    integration_config = get_tiny_aya_integration_config()
    
    validation = {
        "valid": True,
        "errors": [],
        "warnings": [],
        "recommendations": []
    }
    
    # Validar modelo
    if not config.model_path:
        validation["errors"].append("Model path é obrigatório")
        validation["valid"] = False
    
    # Validar URL
    if not config.api_url:
        validation["errors"].append("API URL é obrigatória")
        validation["valid"] = False
    elif not config.api_url.startswith(("http://", "https://")):
        validation["errors"].append("API URL deve começar com http:// ou https://")
        validation["valid"] = False
    
    # Validar parâmetros
    if config.max_tokens < 1 or config.max_tokens > 8192:
        validation["warnings"].append("max_tokens deve estar entre 1 e 8192")
    
    if config.temperature < 0 or config.temperature > 2:
        validation["warnings"].append("temperature deve estar entre 0 e 2")
    
    if config.context_window < 512 or config.context_window > 32768:
        validation["warnings"].append("context_window deve estar entre 512 e 32768")
    
    # Recomendações
    if config.temperature > 1.0:
        validation["recommendations"].append("Considere reduzir temperature para respostas mais consistentes")
    
    if config.max_tokens < 1000:
        validation["recommendations"].append("Considere aumentar max_tokens para respostas mais completas")
    
    if not config.use_gpu and config.n_threads < 4:
        validation["recommendations"].append("Considere aumentar n_threads para melhor performance sem GPU")
    
    return validation
