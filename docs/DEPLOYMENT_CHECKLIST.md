# Production Deployment Checklist (v1.0.0 GA)

Before pointing live user traffic to the AI Job Search Platform, complete this checklist.

## 1. Infrastructure Preparation
- [ ] **VPS/Server Provisioned:** Ensure at least 4GB RAM, 2 vCPUs, and 50GB SSD.
- [ ] **Firewall Configured:** Only ports `80` (HTTP), `443` (HTTPS), and `22` (SSH) should be open to the public internet.
- [ ] **DNS Pointing:** Ensure the `A` record for your domain (e.g., `app.yourdomain.com`) correctly points to the server's public IP.

## 2. Environment Variables & Secrets
- [ ] **`.env` File Created:** Placed securely in the `docker/` directory.
- [ ] **Domain Set:** `DOMAIN=app.yourdomain.com` is configured (Caddy needs this for Let's Encrypt SSL).
- [ ] **Strong Passwords:** `DB_PASSWORD` and `N8N_UI_PASSWORD_HASH` are securely generated and distinct.
- [ ] **API Keys:** `OPENAI_API_KEY` and any other LLM provider keys are valid and funded.
- [ ] **Bearer Token:** `API_BEARER_TOKEN` is set to a secure, random string (do NOT use `DEV_TOKEN_123` in production).

## 3. Docker Initialization
- [ ] **Build & Pull:** Ran `docker compose -f docker-compose.prod.yml pull` and `build`.
- [ ] **Stack Started:** Ran `docker compose -f docker-compose.prod.yml up -d`.
- [ ] **Network Check:** Verified Postgres, Redis, Qdrant, and n8n are connected to the `internal` Docker network.

## 4. Verification
- [ ] **SSL Issued:** Visited `https://app.yourdomain.com` and confirmed the padlock icon appears (Caddy SSL success).
- [ ] **Health Endpoint:** Ran `bash scripts/validate.sh` and confirmed all checks pass.
- [ ] **UI Loading:** Frontend Dashboard loads without errors in the browser console.
- [ ] **Workflows Imported:** Ran `bash scripts/import_workflows.sh` to load the 12 AI agents into the n8n database.

## 5. Ongoing Operations
- [ ] **Cron Healthcheck:** Set up a cronjob or UptimeKuma to hit `https://app.yourdomain.com/webhook/api/v1/health` every 5 minutes.
- [ ] **DB Backups:** Configured a cronjob to run `pg_dumpall` daily.
