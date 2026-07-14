#!/usr/bin/env bash
# =============================================================================
# Healthcheck Script for AI Job Platform Services
# =============================================================================

N8N_URL=${1:-"http://localhost:5678"}
QDRANT_URL=${2:-"http://localhost:6333"}

# Check n8n health
if curl -s -f "$N8N_URL/healthz" > /dev/null; then
  echo "n8n is healthy"
else
  echo "n8n is unhealthy"
  exit 1
fi

# Check Qdrant health
if curl -s -f "$QDRANT_URL/healthz" > /dev/null; then
  echo "Qdrant is healthy"
else
  echo "Qdrant is unhealthy"
  exit 1
fi
