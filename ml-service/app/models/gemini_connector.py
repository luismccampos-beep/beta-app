"""
Gemini Connector (Google Generative Language API)
Replaces local TinyAya usage for text generation.
"""

import logging
from typing import Any, Dict, List, Optional

import httpx
from pydantic import BaseModel

from app.core.config import settings


class GeminiMessage(BaseModel):
    role: str  # system, user, assistant
    content: str


class GeminiResponse(BaseModel):
    content: str
    model: str
    usage: Dict[str, int] = {}


class GeminiConnector:
    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)
        self.api_key = getattr(settings, "GEMINI_API_KEY", None)
        self.model = getattr(settings, "GEMINI_MODEL", "gemini-2.0-flash")
        self.base_url = getattr(
            settings,
            "GEMINI_BASE_URL",
            "https://generativelanguage.googleapis.com/v1beta",
        )

    def _endpoint(self) -> str:
        return f"{self.base_url}/models/{self.model}:generateContent"

    async def generate_text(
        self,
        messages: List[GeminiMessage],
        *,
        temperature: float = 0.3,
        max_tokens: int = 1000,
    ) -> GeminiResponse:
        if not self.api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        system_parts: List[str] = []
        contents: List[Dict[str, Any]] = []
        for m in messages:
            if m.role == "system":
                system_parts.append(m.content)
                continue
            role = "user" if m.role == "user" else "model"
            contents.append({"role": role, "parts": [{"text": m.content}]})

        payload: Dict[str, Any] = {
            "contents": contents or [{"role": "user", "parts": [{"text": ""}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }
        if system_parts:
            payload["systemInstruction"] = {"parts": [{"text": "\n\n".join(system_parts)}]}

        params = {"key": self.api_key}

        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(self._endpoint(), params=params, json=payload)
            if res.status_code != 200:
                self.logger.error("Gemini API error: %s - %s", res.status_code, res.text)
                raise RuntimeError(f"Gemini API error: {res.status_code}")

            data = res.json()
            text = ""
            try:
                text = (
                    data["candidates"][0]["content"]["parts"][0].get("text", "")
                    if data.get("candidates")
                    else ""
                )
            except Exception:
                text = ""

            usage = data.get("usageMetadata") or {}
            mapped_usage = {
                "prompt_tokens": int(usage.get("promptTokenCount") or 0),
                "completion_tokens": int(usage.get("candidatesTokenCount") or 0),
                "total_tokens": int(usage.get("totalTokenCount") or 0),
            }

            return GeminiResponse(content=text, model=self.model, usage=mapped_usage)

