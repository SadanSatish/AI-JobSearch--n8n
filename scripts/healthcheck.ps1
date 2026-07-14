# =============================================================================
# Healthcheck Script for AI Job Platform Services (PowerShell)
# =============================================================================

param (
    [string]$N8nUrl = "http://localhost:5678",
    [string]$QdrantUrl = "http://localhost:6333"
)

# Check n8n health
try {
    $response = Invoke-WebRequest -Uri "$N8nUrl/healthz" -UseBasicParsing -ErrorAction Stop
    Write-Host "n8n is healthy"
} catch {
    Write-Host "n8n is unhealthy"
    exit 1
}

# Check Qdrant health
try {
    $response = Invoke-WebRequest -Uri "$QdrantUrl/healthz" -UseBasicParsing -ErrorAction Stop
    Write-Host "Qdrant is healthy"
} catch {
    Write-Host "Qdrant is unhealthy"
    exit 1
}
