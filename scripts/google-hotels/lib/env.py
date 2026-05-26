"""Load CRAWLBASE_JS_TOKEN from project .env / .env.local."""

from __future__ import annotations

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def _load_env_file(path: Path) -> None:
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        trimmed = line.strip()
        if not trimmed or trimmed.startswith("#"):
            continue
        if "=" not in trimmed:
            continue
        key, _, val = trimmed.partition("=")
        key = key.strip()
        if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", key):
            continue
        if os.environ.get(key) is not None:
            continue
        val = val.strip()
        if (val.startswith('"') and val.endswith('"')) or (
            val.startswith("'") and val.endswith("'")
        ):
            val = val[1:-1]
        os.environ[key] = val


def load_project_env() -> None:
    _load_env_file(ROOT / ".env")
    _load_env_file(ROOT / ".env.local")


def get_crawlbase_js_token() -> str:
    load_project_env()
    token = (
        os.environ.get("CRAWLBASE_JS_TOKEN", "").strip()
        or os.environ.get("CRAWLBASE_TOKEN", "").strip()
    )
    if not token:
        raise RuntimeError(
            "CRAWLBASE_JS_TOKEN not set. Add it to .env.local "
            "(JS token from https://crawlbase.com/dashboard — required for Google Hotels)."
        )
    return token
