#!/usr/bin/env bash
# =============================================================================
# Validation Script for AI Job Platform Services
# =============================================================================

set -e

echo "🔍 Validating Platform Health..."

N8N_URL=${1:-"http://localhost:5678"}
QDRANT_URL=${2:-"http://localhost:6333"}
FRONTEND_URL=${3:-"http://localhost"}

# 1. Check n8n health
echo -n "Checking n8n Orchestrator... "
if curl -s -f "$N8N_URL/healthz" > /dev/null; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  exit 1
fi

# 2. Check Qdrant health
echo -n "Checking Qdrant Vector Store... "
if curl -s -f "$QDRANT_URL/healthz" > /dev/null; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  exit 1
fi

# 3. Check Frontend health
echo -n "Checking Frontend... "
if curl -s -f -I "$FRONTEND_URL" > /dev/null; then
  echo "✅ OK"
else
  echo "⚠️ FAILED (Could be building, or Caddy is not up)"
fi

echo "🎉 All critical services are healthy!"
