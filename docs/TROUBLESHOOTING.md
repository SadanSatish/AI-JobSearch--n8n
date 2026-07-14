# Troubleshooting Guide

## Deployment Failures on Render
- **Error: Failed to connect to database**
  Wait 2-3 minutes. Render provisions databases asynchronously, and the n8n service might start before PostgreSQL is ready. Render will automatically restart the web service.
- **Error: Missing environment variable**
  Check the Render Dashboard -> Blueprint, and ensure you entered values for all required secrets (like `OPENAI_API_KEY`).

## Workflow Execution Fails
- **Node runs out of memory**
  If processing a massive PDF resume fails, n8n might be exceeding its RAM limits. On Render, upgrade the Web Service from `Starter` to `Standard` (1GB RAM).
- **Authentication error in LLM node**
  Verify the API key in Render Dashboard -> Environment.

## Qdrant Connection Issues
- If Qdrant is deployed as a Private Service, its URL is internal (e.g., `jsp-qdrant:6333`). Do not try to access this URL directly from your browser.
- Ensure `QDRANT__SERVICE__API_KEY` is identically matched in the Qdrant service and the n8n configuration.

## Frontend Cannot Reach Backend
- Ensure `VITE_API_BASE_URL` is set to the correct `jsp-n8n.onrender.com` URL. The Vite build process injects this URL statically into the JavaScript bundle. If you change it, you must trigger a manual deploy for the frontend to rebuild.
