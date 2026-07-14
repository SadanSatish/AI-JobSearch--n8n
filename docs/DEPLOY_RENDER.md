# Render Deployment Guide

This project is fully optimized for **Render**. With the included `render.yaml` Blueprint, you can deploy the entire stack automatically.

## Deployment Architecture

- **Frontend:** Render Static Site (Free, builds via `npm run build`, serves `/dist`)
- **Backend Orchestrator (n8n):** Render Web Service (Docker)
- **Database:** Render Managed PostgreSQL
- **Cache/Queue:** Render Managed Redis
- **Vector Store:** Qdrant Cloud (Managed SaaS)
## Step-by-Step Deployment

1. **Push to GitHub**
   Ensure your code is pushed to a GitHub or GitLab repository.

2. **Connect to Render**
   - Log in to your [Render Dashboard](https://dashboard.render.com).
   - Click **New +** and select **Blueprint**.
   - Connect your repository.

3. **Deploy the Blueprint**
   - Render will parse `render.yaml` and discover the 4 components automatically.
   - Click **Apply**.
   - Render will prompt you for any missing Environment Variables (like `OPENROUTER_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`). Fill them in securely in the Render Dashboard.

4. **Verify Deployment**
   - Watch the deployment logs in Render.
   - Once all services are "Live", visit the frontend URL (e.g., `https://jsp-frontend.onrender.com`).
   - The n8n instance will be available at `https://jsp-n8n.onrender.com`.

## Connecting Domain Names
In the Render dashboard, go to the **Settings** for the frontend service, scroll down to **Custom Domains**, and add your domain. Render will automatically issue a free TLS certificate.
