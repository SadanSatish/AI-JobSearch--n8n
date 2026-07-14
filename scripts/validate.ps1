# =============================================================================
# Validation Script for AI Job Platform Services (PowerShell)
# =============================================================================

param (
    [string]$N8nUrl = "http://localhost:5678",
    [string]$QdrantUrl = "http://localhost:6333",
    [string]$FrontendUrl = "http://localhost"
)

Write-Host "🔍 Validating Platform Health..."

# 1. Check n8n health
Write-Host -NoNewline "Checking n8n Orchestrator... "
try {
    $null = Invoke-WebRequest -Uri "$N8nUrl/healthz" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ OK" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    exit 1
}

# 2. Check Qdrant health
Write-Host -NoNewline "Checking Qdrant Vector Store... "
try {
    $null = Invoke-WebRequest -Uri "$QdrantUrl/healthz" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ OK" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    exit 1
}

# 3. Check Frontend health
Write-Host -NoNewline "Checking Frontend... "
try {
    $null = Invoke-WebRequest -Uri "$FrontendUrl" -Method Head -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️ FAILED (Could be building, or Caddy is not up)" -ForegroundColor Yellow
}

Write-Host "🎉 All critical services are healthy!" -ForegroundColor Cyan
