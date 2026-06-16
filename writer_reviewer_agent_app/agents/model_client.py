import json
import os
import time
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

import httpx
import logging

from writer_reviewer_agent_app.agents.local_model import LocalModelClient

logger = logging.getLogger(__name__)


class ModelClient:
    """Wrapper that uses HF remote inference or local transformers fallback.

    - Remote HF Inference API when `HUGGINGFACE_API_TOKEN` is set.
    - Otherwise tries a local `transformers` fallback (lazy). If neither,
      returns a clear stub message.
    """

    def __init__(
        self,
        model_id: Optional[str] = None,
        api_token: Optional[str] = None,
        api_url: Optional[str] = None,
    ):
        self.model_id = model_id or os.getenv("MODEL_ID", "eepSeek-Coder-V2-Lite-Instruct")
        self.api_token = api_token or os.getenv("HUGGINGFACE_API_TOKEN", "")
        self.max_new_tokens = int(os.getenv("MAX_NEW_TOKENS", "512"))
        self.temperature = float(os.getenv("TEMPERATURE", "0.7"))
        self.api_url = api_url or os.getenv("HF_API_URL") or f"https://api-inference.huggingface.co/models/{self.model_id}"
        self.enabled = bool(self.api_token)
        self.local_fallback = LocalModelClient(self.model_id)

        # HTTP client config
        self.timeout = float(os.getenv("HF_TIMEOUT", "60"))
        self.retries = int(os.getenv("HF_RETRIES", "3"))
        self.backoff = float(os.getenv("HF_BACKOFF", "1.0"))

    def _call_remote(self, payload: dict) -> dict:
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        }

        last_exc = None
        for attempt in range(1, self.retries + 1):
            try:
                logger.debug("HF API request attempt %d to %s", attempt, self.api_url)
                with httpx.Client(timeout=self.timeout) as client:
                    resp = client.post(self.api_url, headers=headers, json=payload)
                if resp.status_code >= 500:
                    last_exc = RuntimeError(f"HF API server error: {resp.status_code}")
                    logger.warning("HF API server error %d (attempt %d)", resp.status_code, attempt)
                elif resp.status_code == 429:
                    last_exc = RuntimeError("HF API rate limit (429)")
                    logger.warning("HF API rate limited (attempt %d)", attempt)
                elif resp.status_code >= 400:
                    body = resp.text
                    raise RuntimeError(f"Hugging Face Inference API request failed ({resp.status_code}): {body}")
                else:
                    return resp.json()
            except (httpx.RequestError, RuntimeError) as exc:
                last_exc = exc
                logger.debug("HF API request error on attempt %d: %s", attempt, exc)

            if attempt < self.retries:
                sleep_for = self.backoff * (2 ** (attempt - 1))
                time.sleep(sleep_for)

        raise last_exc

    def generate_text(self, prompt: str, max_tokens: Optional[int] = None, temperature: Optional[float] = None) -> dict:
        """Generate text and return a structured result dict:

        {"text": str, "source": "remote"|"local"|"stub", "model_id": str}
        """
        prompt = (prompt or "").strip()
        if not prompt:
            return {"text": "", "source": "stub", "model_id": self.model_id}

        if self.enabled:
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": max_tokens or self.max_new_tokens,
                    "temperature": temperature if temperature is not None else self.temperature,
                    "return_full_text": False,
                },
            }

            try:
                data = self._call_remote(payload)
            except Exception as exc:
                logger.error("HF remote generation failed: %s", exc)
                if self.local_fallback and self.local_fallback.available:
                    logger.info("Falling back to local model after remote failure")
                    return self.local_fallback.generate_text(
                        prompt, max_tokens=max_tokens or self.max_new_tokens, temperature=temperature if temperature is not None else self.temperature
                    )
                raise

            if isinstance(data, dict) and data.get("error"):
                raise RuntimeError(f"Hugging Face Inference API error: {data['error']}")

            # Parse common HF inference shapes and return structured dict
            text = None
            if isinstance(data, list) and data and isinstance(data[0], dict) and "generated_text" in data[0]:
                text = data[0]["generated_text"]
            elif isinstance(data, dict) and "generated_text" in data:
                text = data["generated_text"]
            else:
                text = json.dumps(data)

            return {"text": (text or "").strip(), "source": "remote", "model_id": self.model_id}
        if self.local_fallback.available:
            return self.local_fallback.generate_text(prompt, max_tokens=max_tokens or self.max_new_tokens, temperature=temperature if temperature is not None else self.temperature)

        return {
            "text": (
                "[Stub model output] Set HUGGINGFACE_API_TOKEN to enable remote generation, or install transformers and a local model for offline use.\n"
                f"Prompt:\n{prompt}"
            ),
            "source": "stub",
            "model_id": self.model_id,
        }
