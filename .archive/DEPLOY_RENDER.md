# Deploying on Render

This project is configured to be deployed using **Render Blueprints**. 
The `render.yaml` file defines the infrastructure, services, and environment requirements.

## 1. Prerequisites

Before you deploy to Render, ensure you have the following accounts and resources ready:
- **Neon PostgreSQL**: For the database. **CRITICAL: You must create a BRAND NEW database or Neon Branch for this deployment.** n8n must initialize its schema from scratch. You must use the Neon Direct Connection, not the Pooled Connection (ensure your connection string/host does NOT contain `-pooler`).
- **Upstash Redis**: For caching and queue management.
- **Qdrant Cloud**: For the vector database.
- **Render Account**: For hosting the web services (n8n and Frontend).
- **API Keys**: OpenRouter, Google Gemini, OpenAI, etc.

## 2. Deployment Steps

1. **Connect Repository**: In the Render Dashboard, go to **Blueprints** and click **New Blueprint Instance**.
2. **Select Repository**: Choose your GitHub repository containing this project.
3. **Configure Environment Variables**: Render will parse the `render.yaml` file and prompt you to enter the required environment variables (marked as `sync: false`).
   - You must fill out all the secrets from your local `.env` file here.
   - **Do not** check in your `.env` to GitHub. It is ignored by `.gitignore`.
4. **Deploy**: Click **Apply** to provision the services. Render will automatically build and deploy both the `jsp-n8n` backend and the `jsp-frontend` static site.

### Important: Production Constraints on Free Tier
- **Memory Caps:** The Render Free Tier has a strict 512MB RAM limit. To prevent out-of-memory (OOM) crashes, `render.yaml` caps the Node heap (`NODE_OPTIONS=--max-old-space-size=384`) and forces workflows to execute in the main process (`EXECUTIONS_PROCESS=main`).
- **Binary Data:** Binary data is saved to the filesystem instead of the database to conserve memory.
- **Docker Version:** We strictly peg `Dockerfile.n8n` to a stable version (e.g. `1.53.0`) rather than `latest` to ensure predictable builds and startup sequences.

## 3. Adding Environment Variables

If you need to add new environment variables in the future:
1. Update `render.yaml` to define the new variable. If it is a secret, ensure you add `sync: false`.
2. Commit and push the changes.
3. In the Render Dashboard, go to your service's **Environment** tab.
4. Render will prompt you to provide the value for the newly defined secret.

## 4. Rotating Secrets

Security best practices require rotating secrets periodically or if they are compromised:
1. Generate the new secret (e.g., a new `N8N_ENCRYPTION_KEY` or `JWT_SECRET`).
2. Go to the Render Dashboard > select your service > **Environment**.
3. Update the specific variable with the new secret value.
4. **Manual Deploy**: Click **Manual Deploy** -> **Deploy latest commit** to restart the service with the new environment variables.

## 5. Safe Deployment Practices

- **Never Hardcode Secrets**: Always use environment variables for passwords, API keys, and tokens.
- **Use .env.example**: If you add new required variables, update `.env.example` with dummy placeholders so other developers know what is required.
- **Secret Scanning**: GitHub Secret Scanning is enabled by default to prevent accidental commits of sensitive keys.
