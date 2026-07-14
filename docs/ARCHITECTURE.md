# Architecture

## Overview
The architecture is decoupled into standard microservice tiers tailored for Render Free deployment.

1. **Frontend (Static Site)**: React SPA served by Nginx (in Docker) or Render Static Site.
2. **Backend (Web Service)**: Node.js Express server to handle rate-limiting, env loading, and proxying to n8n securely.
3. **Workflow Engine (Private Service)**: n8n 1.53.0 instance orchestrating all LLM calls.
4. **Data Layer**: Neon PostgreSQL (Relational) + Upstash Redis (Queue/Cache) + Qdrant (Vector).
