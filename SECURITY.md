# Security Architecture

This document outlines the security practices implemented in this project to ensure a secure production environment.

## Environment Variable Security

- **No Secrets in Code**: All sensitive credentials, API keys, and passwords are externalized using environment variables. 
- **.env Ignored**: The `.env` file is strictly ignored in Git via `.gitignore`.
- **.dockerignore**: Secrets are prevented from being copied into Docker images during the build process via `.dockerignore`.
- **Render Secrets**: We utilize Render's `sync: false` feature in `render.yaml` so that secrets are never stored in the repository's configuration files, but are securely injected at runtime from the Render Dashboard.

## Secret Management

- **Centralized Environment**: All secrets are centralized in the root `.env` file for local development. Do not create scattered `.env` files (e.g., in `docker/` or `frontend/`).
- **N8N Encryption Key**: The `N8N_ENCRYPTION_KEY` encrypts sensitive credentials within the n8n database. This key is securely passed via the environment.
- **JWT & Bearer Tokens**: All API endpoints and integrations are secured using strong, randomly generated `JWT_SECRET` and `API_BEARER_TOKEN` keys.

## Git Security

- `credentials.json` and `service-account.json` are excluded from version control.
- PEM keys (`*.pem`, `*.key`, `*.p12`) are globally ignored.
- Build artifacts, `node_modules`, and local logs are never committed.

## Runtime Security

- Services run with least-privilege configurations where possible.
- The n8n backend is configured to use basic authentication (`N8N_BASIC_AUTH_ACTIVE=true`).
- No default hardcoded passwords are used for any database or service initialization; everything relies on the secure environment configuration.
