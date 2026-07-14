# Deploying to Render

This repository uses a fully automated Render Blueprint (`render.yaml`) to deploy the entire stack.

## Architecture

- **PostgreSQL**: Render Managed Database (Stores n8n internal state and application platform data).
- **Key-Value Store (Redis)**: Render Managed Key-Value Store (Provides Bull queue and caching for n8n workers).
- **Backend**: n8n Web Service running via Docker.
- **Frontend**: React/Vite Static Site.

## Prerequisites

1. A [Render account](https://render.com/).
2. A GitHub account linked to Render.
3. Access to external API keys for LLMs and job boards (e.g., OpenAI, Gemini, Adzuna).

## Initial Deployment Steps

1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect this GitHub repository.
4. Render will parse the `render.yaml` file. Because some secrets (like API keys and Redis hostnames) cannot be hardcoded or automatically inferred, Render will prompt you to enter them before it provisions the infrastructure.

### Required Manual Inputs

During the Blueprint setup, you will be prompted to provide values for variables marked as `sync: false`.

#### Key-Value (Redis) Connections
Render's Key-Value service does not use passwords, but you must manually link its internal connection hostname.
* **Wait for Key-Value Creation**: You may need to let the Blueprint partially fail or skip providing these initially. Once the `jsp-redis` service is created in Render, click on it, go to the **Connect** menu, and select **Internal**. 
* Copy the hostname (it usually looks like `jsp-redis-abc1234` or a full internal URL).
* Paste the hostname into the **`QUEUE_BULL_REDIS_HOST`** and **`REDIS_HOST`** environment variables in your `jsp-n8n` service.
* Set both **`QUEUE_BULL_REDIS_PORT`** and **`REDIS_PORT`** to `6379`.

#### n8n Authentication
* **`N8N_BASIC_AUTH_PASSWORD`**: Set a secure password to access your n8n dashboard.
* **`ENCRYPTION_KEY_PII`**: A random secure string to encrypt PII data within n8n.
* **`API_BEARER_TOKEN`**: A secure token that the frontend will use to authenticate requests to n8n webhooks.

#### External APIs & Storage
Provide your API keys for the following variables:
* `OPENROUTER_API_KEY`
* `GEMINI_API_KEY`
* `OPENAI_API_KEY`
* `ANTHROPIC_API_KEY`
* `SERPAPI_KEY`
* `ADZUNA_APP_ID`
* `ADZUNA_APP_KEY`
* `RAPIDAPI_KEY`
* `QDRANT_URL` and `QDRANT_API_KEY` (Your Qdrant cloud vector store details)
* `S3_BUCKET`, `SMTP_HOST`, `SMTP_PASSWORD` (If using S3 and Email notifications)

## Continuous Deployment

Once the initial deployment is successful, any push to the `main` branch will automatically trigger a rebuild and redeployment of the modified services (thanks to `autoDeployTrigger: commit`).

The frontend is configured to automatically generate Preview Environments for Pull Requests (`previews.generation: automatic`).
