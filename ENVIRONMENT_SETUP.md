# Environment Setup

This project relies entirely on environment variables to manage configuration and secrets. 

## Local Setup

1. **Locate the Template**: Find `.env.example` in the root of the project.
2. **Copy the Template**: Duplicate it and name the new file `.env`.
   ```bash
   cp .env.example .env
   ```
3. **Populate Values**: Open `.env` and replace all dummy placeholders with your actual credentials.
   - **Database**: Get your `DATABASE_URL` from Neon. Ensure it includes `?sslmode=require` at the end.
   - **Redis**: Get your `REDIS_URL` and `REDIS_PASSWORD` from Upstash.
   - **Vector Store**: Get your `QDRANT_URL` and `QDRANT_API_KEY` from Qdrant Cloud.
   - **AI Providers**: Populate `OPENROUTER_API_KEY` and `GEMINI_API_KEY`.
   - **Security**: Generate strong random strings for `N8N_ENCRYPTION_KEY`, `N8N_BASIC_AUTH_PASSWORD`, `JWT_SECRET`, and `API_BEARER_TOKEN`.

## Verification

Do not place `.env` files in subdirectories (e.g., `docker/.env`). Keep a single master `.env` in the root directory. `docker-compose` will automatically load variables from this file.

## Production Setup

For production, do not upload your local `.env`. The project uses Render Blueprints (`render.yaml`). When you deploy, the Render Dashboard will automatically prompt you to enter the secure environment variables. See [DEPLOY_RENDER.md](DEPLOY_RENDER.md) for details.
