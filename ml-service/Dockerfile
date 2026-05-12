# === Stage 1: Builder (compile/install dependencies) ===
FROM python:3.11-slim AS builder

WORKDIR /app

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_REQUIRE_HASHES=0

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY app/requirements/requirements*.txt ./

# ARG to choose dev vs prod dependencies
ARG DEV=false

# Install Python dependencies
RUN if [ "$DEV" = "true" ] ; then \
        pip install --no-cache-dir -r requirements-all.txt ; \
    else \
        pip install --no-cache-dir -r requirements.txt ; \
    fi

# === Stage 2: Runtime ===
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONPATH=/app

# Install only runtime system deps
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /usr/local /usr/local

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m appuser \
    && mkdir -p /app/logs \
    && chown -R appuser:appuser /app
USER appuser

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
