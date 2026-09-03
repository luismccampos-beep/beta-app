"""Shared test configuration.

Enables API-key auth for all endpoint tests: the API router is protected by
``require_api_key``, so tests must send the matching ``x-api-key`` header.
"""

from app.core.config import settings

settings.API_KEY = "test-api-key"
settings.ENVIRONMENT = "test"

# ---------------------------------------------------------------------------
# Seed analytics CSVs for CI.
#
# `app/data/*.csv` are gitignored (runtime data), so the predictions endpoints
# that read `app/data/interactions.csv` / `app/data/items.csv` would fail with
# 500s in CI. Copy committed fixtures into place if the files are missing.
# ---------------------------------------------------------------------------
import shutil
from pathlib import Path

_APP_DATA = Path(__file__).resolve().parent.parent / "app" / "data"
_FIXTURES = Path(__file__).resolve().parent / "fixtures"

for _name in ("interactions.csv", "items.csv"):
    _target = _APP_DATA / _name
    if not _target.exists():
        _APP_DATA.mkdir(parents=True, exist_ok=True)
        shutil.copy(_FIXTURES / _name, _target)
