# ==========================================
# Stage 1: Build Dependencies
# ==========================================
FROM python:3.11.10-alpine3.20 AS builder

WORKDIR /build

# Install build dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev

COPY pyproject.toml .

# Create virtual environment and install dependencies
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip==24.2 && \
    /opt/venv/bin/pip install --no-cache-dir .

# ==========================================
# Stage 2: Final Minimal Runtime
# ==========================================
FROM python:3.11.10-alpine3.20 AS runtime

LABEL maintainer="PulseWatch Team <kaneezezahra313@gmail.com>" \
      version="1.0.0" \
      description="PulseWatch Cloud Observability API Service"

WORKDIR /app

# Create unprivileged system group & user (Non-root security requirement)
RUN addgroup -S -g 10001 appgroup && \
    adduser -S -u 10001 -G appgroup -h /app -s /sbin/nologin appuser

# Copy virtual environment from builder stage
COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv

# Copy application source code
COPY --chown=appuser:appgroup ./app /app/app

# Set environment paths and security configurations
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ENVIRONMENT=production \
    PORT=8000

# Drop root privileges and switch to appuser
USER appuser

EXPOSE 8000

# Health check matching AWS ALB probe
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/healthz', timeout=2)" || exit 1

ENTRYPOINT ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
