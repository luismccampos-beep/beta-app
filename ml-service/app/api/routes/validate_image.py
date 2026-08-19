"""
Image Validation API Routes
Validação de imagens usando CLIP zero-shot e heurísticas
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import asyncio
import ipaddress
import logging
import socket
import time
from io import BytesIO
from urllib.parse import urlparse
import requests
from cachetools import TTLCache

from app.core.logger import logger

router = APIRouter(prefix="/validate-image", tags=["validate-image"])

# ─────────────────────────── cache ───────────────────────────

# Cache de 1 hora para resultados de validação
_validation_cache = TTLCache(maxsize=1000, ttl=3600)

# ─────────────────────── download safety ─────────────────────

MAX_IMAGE_BYTES = 20 * 1024 * 1024  # 20 MB
IMAGE_DOWNLOAD_TIMEOUT = 10

# Hosts that can never be fetched (local/loopback/link-local/etc.)
_PRIVATE_HOSTNAMES = {"localhost", "localhost.localdomain"}


def _is_private_host(host: str) -> bool:
    """Return True if ``host`` resolves (or points) to a private address."""
    if host in _PRIVATE_HOSTNAMES or host.endswith(".local"):
        return True
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        # Unresolvable hosts are rejected (fail closed) to avoid rebinding attacks.
        return True
    for info in infos:
        try:
            ip = ipaddress.ip_address(info[4][0])
        except ValueError:
            return True
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        ):
            return True
    return False


def _is_safe_image_url(url: str) -> bool:
    """Block SSRF: only http(s) URLs resolving to public addresses are allowed."""
    try:
        parsed = urlparse(url)
    except ValueError:
        return False
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        return False
    return not _is_private_host(parsed.hostname)


def _download_image(url: str) -> bytes:
    """Stream-download an image with a hard size cap (blocks the caller thread)."""
    response = requests.get(url, timeout=IMAGE_DOWNLOAD_TIMEOUT, stream=True)
    response.raise_for_status()
    content_length = response.headers.get("Content-Length")
    if content_length and int(content_length) > MAX_IMAGE_BYTES:
        response.close()
        raise ValueError(f"image exceeds {MAX_IMAGE_BYTES // (1024 * 1024)} MB limit")
    chunks = []
    total = 0
    for chunk in response.iter_content(chunk_size=64 * 1024):
        total += len(chunk)
        if total > MAX_IMAGE_BYTES:
            response.close()
            raise ValueError(f"image exceeds {MAX_IMAGE_BYTES // (1024 * 1024)} MB limit")
        chunks.append(chunk)
    response.close()
    return b"".join(chunks)


# ─────────────────────────── models ──────────────────────────

class ValidateImageRequest(BaseModel):
    """Corpo da requisição para validação de imagem."""
    image_url: str = Field(..., description="URL da imagem a validar")
    candidate_labels: List[str] = Field(
        ...,
        min_length=2,
        max_length=10,
        description="Labels candidatos para classificação (ex: ['Lisboa, Portugal', 'other place'])"
    )


class ValidateImageResponse(BaseModel):
    """Resposta da validação de imagem."""
    scores: List[float] = Field(..., description="Scores para cada label (soma = 1.0)")
    labels: List[str] = Field(..., description="Labels correspondentes")
    top_label: str = Field(..., description="Label com maior score")
    top_score: float = Field(..., description="Score do label principal")
    cached: bool = Field(default=False, description="Se o resultado veio do cache")


# ─────────────────────────── CLIP validation ─────────────────

def _validate_with_clip(image_bytes: bytes, candidate_labels: List[str]) -> Optional[dict]:
    """
    Valida imagem usando CLIP zero-shot.
    Retorna None se o modelo não estiver disponível.
    """
    try:
        import torch
        from transformers import CLIPProcessor, CLIPModel
        from PIL import Image

        # Carregar modelo (cacheado em memória após primeira carga)
        if not hasattr(_validate_with_clip, 'model'):
            logger.info("Carregando modelo CLIP...")
            _validate_with_clip.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            _validate_with_clip.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
            logger.info("Modelo CLIP carregado com sucesso")

        model = _validate_with_clip.model
        processor = _validate_with_clip.processor

        image = Image.open(BytesIO(image_bytes)).convert("RGB")

        # Processar
        inputs = processor(
            text=candidate_labels,
            images=image,
            return_tensors="pt",
            padding=True
        )
        outputs = model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)[0].tolist()

        return {
            "scores": probs,
            "labels": candidate_labels,
            "top_label": candidate_labels[probs.index(max(probs))],
            "top_score": max(probs)
        }

    except ImportError as e:
        logger.warning(f"CLIP não disponível: {e}")
        return None
    except Exception as e:
        logger.error(f"Erro na validação CLIP: {e}", exc_info=True)
        return None


# ─────────────────────────── routes ──────────────────────────

@router.post("/", response_model=ValidateImageResponse, summary="Validar imagem")
async def validate_image(request: ValidateImageRequest):
    """
    Valida se uma imagem corresponde a um destino usando CLIP zero-shot.

    - **image_url**: URL da imagem para validar
    - **candidate_labels**: Lista de labels candidatos (ex: ['Lisboa, Portugal', 'other place', 'food'])

    Retorna scores de probabilidade para cada label.
    Resultados são cacheados por 1 hora para performance.
    """
    start_time = time.time()

    # SSRF guard: reject private/internal URLs before any processing or cache hit.
    if not _is_safe_image_url(request.image_url):
        raise HTTPException(
            status_code=400,
            detail="image_url must be a public http(s) URL",
        )

    # Verificar cache
    cache_key = f"{request.image_url}:{':'.join(request.candidate_labels)}"
    if cache_key in _validation_cache:
        cached_result = _validation_cache[cache_key]
        logger.info(
            "Validação de imagem (cache hit)",
            extra={"image_url": request.image_url, "latency_ms": (time.time() - start_time) * 1000}
        )
        return ValidateImageResponse(
            **cached_result,
            cached=True
        )

    # Download da imagem (off-thread, com limite de tamanho e SSRF guard)
    try:
        image_bytes = await asyncio.to_thread(_download_image, request.image_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Falha ao baixar imagem: {e}")

    # Executar validação CLIP (off-thread: inference is CPU/GPU-bound)
    result = await asyncio.to_thread(_validate_with_clip, image_bytes, request.candidate_labels)

    if result is None:
        # CLIP não disponível ou erro
        logger.warning(
            "Validação CLIP falhou, retornando scores neutros",
            extra={"image_url": request.image_url}
        )
        # Retornar scores uniformes como fallback
        n = len(request.candidate_labels)
        uniform_score = 1.0 / n
        result = {
            "scores": [uniform_score] * n,
            "labels": request.candidate_labels,
            "top_label": request.candidate_labels[0],
            "top_score": uniform_score
        }

    # Salvar no cache
    _validation_cache[cache_key] = result

    latency = (time.time() - start_time) * 1000
    logger.info(
        "Validação de imagem concluída",
        extra={
            "image_url": request.image_url,
            "top_label": result["top_label"],
            "top_score": result["top_score"],
            "latency_ms": latency
        }
    )

    return ValidateImageResponse(
        **result,
        cached=False
    )


@router.get("/health", summary="Health check da validação")
async def health_check():
    """Verifica se o modelo CLIP está carregado."""
    has_model = hasattr(_validate_with_clip, 'model')
    return {
        "status": "healthy" if has_model else "degraded",
        "clip_loaded": has_model,
        "cache_size": len(_validation_cache),
        "cache_maxsize": _validation_cache.maxsize
    }