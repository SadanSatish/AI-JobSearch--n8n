# Deployment Guide (RC1)

This guide walks you through deploying the AI Job Search Platform Version 1.0 to a single-node VPS (e.g., DigitalOcean Droplet, AWS EC2, or Hetzner).

## Prerequisites
1. A Linux server (Ubuntu 22.04 recommended) with at least 4GB RAM and 2 vCPUs.
2. Docker and Docker Compose installed.
3. A domain name pointed to your server's IP address (e.g., `app.yourdomain.com`).

## 1. Setup Environment Variables
Clone the repository to your server and create the `.env` file in the `/docker` directory.

```bash
cp .env.example docker/.env
```

Edit `docker/.env`:
- `DOMAIN`: Set this to your domain (e.g., `app.yourdomain.com`). Caddy will automatically fetch a Let's Encrypt SSL certificate for this domain.
- `DB_PASSWORD`: Set a strong password.
- `OPENAI_API_KEY`: Required for embedding and semantic search.
- `API_BEARER_TOKEN`: The token used to authenticate frontend-to-backend API calls.
- `N8N_UI_PASSWORD_HASH`: Generate this by running `docker run caddy:2-alpine caddy hash-password --plaintext YOUR_PASSWORD`.

## 2. Start the Stack
Navigate to the `/docker` directory and bring up the production stack in detached mode:

```bash
cd docker
docker compose -f docker-compose.prod.yml up -d
```

## 3. Import Workflows
Once the n8n container is healthy, you must import the agent workflows into the database. Run the provided shell script from the host:

```bash
cd ..
bash scripts/import_workflows.sh
```

## 4. Verify Health
Ping the API health endpoint to ensure the database, Redis, and Qdrant are fully connected:

```bash
curl -H "Authorization: Bearer <API_BEARER_TOKEN>" https://app.yourdomain.com/webhook/api/v1/health
```

If it returns `{"status":"OK"}`, the system is fully production-ready.

## 5. Security Notes
- The Postgres, Redis, and Qdrant ports are completely blocked from the public internet; they only exist on the `internal` Docker network.
- The Caddy reverse proxy automatically applies SSL and implements rate limiting (100 requests / minute) on all API endpoints.
