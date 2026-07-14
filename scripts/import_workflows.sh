#!/bin/bash
# =============================================================================
# import_workflows.sh — Import all n8n workflow JSONs via n8n REST API
# Usage: bash scripts/import_workflows.sh
# Requires: n8n running on localhost:5678
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# Load env vars
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)
fi

N8N_URL="${N8N_WEBHOOK_URL:-http://localhost:5678}"
N8N_USER="${N8N_BASIC_AUTH_USER:-admin}"
N8N_PASS="${N8N_BASIC_AUTH_PASSWORD}"

if [ -z "$N8N_PASS" ]; then
  echo "✗ N8N_BASIC_AUTH_PASSWORD not set in .env"
  exit 1
fi

echo ""
echo "→ Importing n8n workflows from: $PROJECT_ROOT/workflows/"
echo "  n8n URL: $N8N_URL"
echo ""

IMPORTED=0
FAILED=0

import_workflow() {
  local filepath=$1
  local filename=$(basename "$filepath")

  response=$(curl -s -w "\n%{http_code}" \
    -X POST "$N8N_URL/api/v1/workflows" \
    -u "$N8N_USER:$N8N_PASS" \
    -H "Content-Type: application/json" \
    -d "@$filepath")

  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | head -n -1)

  if echo "$http_code" | grep -qE "^(200|201)$"; then
    workflow_name=$(echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('name','?'))" 2>/dev/null || echo "$filename")
    echo "  ✓ Imported: $workflow_name"
    IMPORTED=$((IMPORTED + 1))
  else
    echo "  ✗ Failed:   $filename (HTTP $http_code)"
    FAILED=$((FAILED + 1))
  fi
}

# Import utilities first (dependencies)
echo "  [Utilities]"
for f in "$PROJECT_ROOT"/workflows/utilities/*.json; do
  [ -f "$f" ] && import_workflow "$f"
done

# Import agents
echo ""
echo "  [Agents]"
for f in "$PROJECT_ROOT"/workflows/agents/*.json; do
  [ -f "$f" ] && import_workflow "$f"
done

# Import master workflow last
echo ""
echo "  [Master Workflow]"
for f in "$PROJECT_ROOT"/workflows/master/*.json; do
  [ -f "$f" ] && import_workflow "$f"
done

echo ""
echo "Import complete: $IMPORTED succeeded, $FAILED failed"
echo ""
echo "→ Open n8n to activate workflows: $N8N_URL"
