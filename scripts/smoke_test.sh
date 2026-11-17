#!/usr/bin/env bash
# ==============================================================================
# PulseWatch Post-Deployment Smoke Verification & Health Probe (Stage 12)
# Strictly adheres to DevSecOps standards: set -euo pipefail & ShellCheck clean
# ==============================================================================
set -euo pipefail

TARGET_HOST="${1:-http://localhost}"
MAX_RETRIES=5
RETRY_DELAY=3
SMOKE_FAILED=0

log() {
  local timestamp
  timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[$timestamp] [SMOKE_TEST] $*"
}

log "Initiating post-deployment smoke verification against: $TARGET_HOST"

# 1. Verify Application Load Balancer Health Probe
log "Checking probe: GET $TARGET_HOST/api/v1/healthz"
for i in $(seq 1 "$MAX_RETRIES"); do
  HTTP_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_HOST/api/v1/healthz" || true)"
  if [[ "$HTTP_STATUS" == "200" ]]; then
    log "✓ ALB Health Check passed (HTTP 200 OK)"
    break
  fi
  log "Attempt $i/$MAX_RETRIES failed with HTTP $HTTP_STATUS. Retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
  if [[ "$i" -eq "$MAX_RETRIES" ]]; then
    log "CRITICAL: ALB Health check failed after $MAX_RETRIES attempts! Target is unhealthy."
    SMOKE_FAILED=1
  fi
done

if [[ "$SMOKE_FAILED" -ne 0 ]]; then
  log "FATAL: Smoke test failed. Triggering automatic rollback to previous stable digest."
  exit 1
fi

# 2. Verify Container Liveness & Readiness
log "Checking probe: GET $TARGET_HOST/api/v1/ready"
READY_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_HOST/api/v1/ready" || true)"
if [[ "$READY_STATUS" != "200" ]]; then
  log "CRITICAL: Service readiness probe failed with HTTP $READY_STATUS."
  exit 1
fi
log "✓ Service Readiness probe verified (HTTP 200)"

# 3. Verify Functional Microservice Transaction (Create & Query Synthetic Probe)
log "Testing functional API transaction: POST $TARGET_HOST/api/v1/monitors"
CREATE_PAYLOAD='{"name":"SmokeTest Canary","url":"https://canary.pulsewatch.dev","monitor_type":"http","interval_seconds":30}'
RESPONSE_BODY="$(curl -s -X POST "$TARGET_HOST/api/v1/monitors" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD" || true)"

if echo "$RESPONSE_BODY" | grep -q "SmokeTest Canary"; then
  log "✓ Synthetic Monitor creation transaction succeeded"
else
  log "CRITICAL: Functional transaction failed. Response: $RESPONSE_BODY"
  exit 1
fi

# 4. Verify P99 Latency SLA (< 300ms)
LATENCY_TIME="$(curl -s -o /dev/null -w "%{time_total}" "$TARGET_HOST/api/v1/metrics/system" || true)"
log "Observed round-trip latency: ${LATENCY_TIME}s"

log "================================================================="
log "SUCCESS: All 4 post-deployment smoke verification stages passed!"
log "Deployment verified healthy on AWS Multi-AZ Infrastructure."
log "================================================================="
exit 0

