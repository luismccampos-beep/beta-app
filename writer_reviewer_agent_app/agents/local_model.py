import os
from typing import Optional

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
except Exception:
    AutoModelForCausalLM = None
    AutoTokenizer = None
    pipeline = None


class LocalModelClient:
    """Local model fallback using Hugging Face transformers.

    Initialization is lazy and uses `local_files_only=True` to avoid unexpected
    large downloads during example runs. To enable automatic downloads set a
    different code path or pre-cache the model via `transformers` CLI.
    """

    def __init__(self, model_id: Optional[str] = None):
        self.model_id = model_id or os.getenv("MODEL_ID", "eepSeek-Coder-V2-Lite-Instruct")
        self.model = None
        self.tokenizer = None
        self.pipeline = None
        self.available = False
        self._initialized = False

    def _initialize(self):
        if self._initialized:
            return
        self._initialized = True

        if AutoModelForCausalLM is None or AutoTokenizer is None or pipeline is None:
            self.available = False
            return

        try:
            # Use local files only by default to avoid background downloads in examples.
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_id, local_files_only=True)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_id, local_files_only=True)
            self.pipeline = pipeline("text-generation", model=self.model, tokenizer=self.tokenizer)
            self.available = True
        except Exception:
            self.available = False

    def generate_text(self, prompt: str, max_tokens: int = 512, temperature: float = 0.7) -> dict:
        prompt = (prompt or "").strip()
        if not prompt:
            return {"text": "", "source": "local", "model_id": self.model_id}

        self._initialize()
        if not self.available:
            return {
                "text": "[Local model not available] Install transformers and ensure the model cache is present locally.",
                "source": "local",
                "model_id": self.model_id,
            }

        results = self.pipeline(prompt, max_new_tokens=max_tokens, temperature=temperature, do_sample=True)
        text = ""
        if isinstance(results, list) and results:
            text = results[0].get("generated_text", "").strip()

        return {"text": text, "source": "local", "model_id": self.model_id}
