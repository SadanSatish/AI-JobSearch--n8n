#!/bin/bash
# =============================================================================
# setup.sh — One-Command Local Development Setup
# AI Job & Internship Search Platform
# Usage: bash scripts/setup.sh
# =============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   AI Job & Internship Search Platform — Setup v1.0.0        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 1: Check dependencies
# ─────────────────────────────────────────────────────────────────
echo "→ Checking dependencies..."

command -v docker       >/dev/null 2>&1 || { echo "✗ Docker is not installed. Install from https://docker.com"; exit 1; }
command -v docker       >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 || { echo "✗ Docker Compose v2 is required."; exit 1; }

echo "  ✓ Docker:          $(docker --version)"
echo "  ✓ Docker Compose:  $(docker compose version)"

# ─────────────────────────────────────────────────────────────────
# Step 2: Create .env if missing
# ─────────────────────────────────────────────────────────────────
ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"

if [ ! -f "$ENV_FILE" ]; then
  echo ""
  echo "→ Creating .env from .env.example..."
  cp "$ENV_EXAMPLE" "$ENV_FILE"

  # Auto-generate secrets
  N8N_PASSWORD=$(openssl rand -base64 24 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(24))")
  N8N_KEY=$(openssl rand -hex 32       2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(32))")
  DB_PASS=$(openssl rand -base64 24    2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(24))")
  REDIS_PASS=$(openssl rand -base64 16 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(16))")
  PII_KEY=$(openssl rand -hex 32       2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(32))")

  # Write generated secrets to .env
  sed -i.bak "s/N8N_BASIC_AUTH_PASSWORD=.*/N8N_BASIC_AUTH_PASSWORD=$N8N_PASSWORD/"   "$ENV_FILE"
  sed -i.bak "s/N8N_ENCRYPTION_KEY=.*/N8N_ENCRYPTION_KEY=$N8N_KEY/"                 "$ENV_FILE"
  sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/"                               "$ENV_FILE"
  sed -i.bak "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASS/"                     "$ENV_FILE"
  sed -i.bak "s/ENCRYPTION_KEY_PII=.*/ENCRYPTION_KEY_PII=$PII_KEY/"               "$ENV_FILE"
  rm -f "$ENV_FILE.bak"

  echo "  ✓ .env created with auto-generated secrets"
  echo ""
  echo "  ⚠️  IMPORTANT: Add your API keys to .env before starting:"
  echo "     OPENROUTER_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY"
  echo "     SERPAPI_KEY or ADZUNA_APP_ID/ADZUNA_APP_KEY"
  echo ""
else
  echo "  ✓ .env already exists — skipping"
fi

# ─────────────────────────────────────────────────────────────────
# Step 3: Create local directories
# ─────────────────────────────────────────────────────────────────
echo "→ Creating directories..."
mkdir -p "$PROJECT_ROOT/storage"
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$PROJECT_ROOT/cache"
echo "  ✓ storage/, logs/, cache/ created"

# ─────────────────────────────────────────────────────────────────
# Step 4: Start Docker stack
# ─────────────────────────────────────────────────────────────────
echo ""
echo "→ Starting Docker services (this may take a few minutes on first run)..."
cd "$PROJECT_ROOT"

docker compose --profile dev up -d --build

echo ""
echo "→ Waiting for services to be healthy..."
sleep 15

# ─────────────────────────────────────────────────────────────────
# Step 5: Health checks
# ─────────────────────────────────────────────────────────────────
echo "→ Checking service health..."

check_service() {
  local name=$1
  local url=$2
  local retries=10
  local count=0

  while [ $count -lt $retries ]; do
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -qE "^(200|401|403)$"; then
      echo "  ✓ $name is healthy"
      return 0
    fi
    count=$((count + 1))
    sleep 3
  done
  echo "  ⚠️  $name did not respond within timeout — check: docker compose logs $name"
  return 1
}

check_service "n8n"     "http://localhost:5678/healthz"
check_service "Qdrant"  "http://localhost:6333/healthz"

echo ""

# ─────────────────────────────────────────────────────────────────
# Step 6: Create Qdrant collections
# ─────────────────────────────────────────────────────────────────
echo "→ Creating Qdrant vector collections..."

create_qdrant_collection() {
  local name=$1
  curl -s -X PUT "http://localhost:6333/collections/$name" \
    -H "Content-Type: application/json" \
    -d '{"vectors": {"size": 1536, "distance": "Cosine"}, "optimizers_config": {"default_segment_number": 2}}' \
    | grep -q '"result":true' && echo "  ✓ Collection: $name" || echo "  ⚠️  Collection $name may already exist"
}

create_qdrant_collection "jobs"
create_qdrant_collection "resumes"
create_qdrant_collection "companies"

# ─────────────────────────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   Setup Complete! ✅                         ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  n8n Dashboard:  http://localhost:5678                       ║"
echo "║  pgAdmin:        http://localhost:5050                       ║"
echo "║  Qdrant:         http://localhost:6333/dashboard             ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Next Steps:                                                  ║"
echo "║  1. Open n8n: http://localhost:5678                           ║"
echo "║  2. Import all workflows from: workflows/                     ║"
echo "║     bash scripts/import_workflows.sh                         ║"
echo "║  3. Configure API keys in n8n Credentials                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
