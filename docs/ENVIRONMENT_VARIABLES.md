# Environment Variables Documentation

This file documents all environment variables used in the platform.

### Orchestrator (n8n)
- `N8N_ENCRYPTION_KEY`: A secure random string used to encrypt credentials in the database. **Keep this safe**.
- `N8N_BASIC_AUTH_ACTIVE`: Set to `true` to require a password to access the workflow UI.
- `WEBHOOK_URL`: The public-facing URL of the n8n instance (e.g., `https://jsp-n8n.onrender.com`).

### Database & Redis
- `DB_TYPE`: `postgresdb`
- `DB_POSTGRESDB_HOST`: Hostname of PostgreSQL
- `DB_POSTGRESDB_PASSWORD`: Password for the DB.
- *(Managed automatically by Render Blueprints)*

### AI Models
- `OPENROUTER_API_KEY`: Key for routing LLM requests.
- `GEMINI_API_KEY`: Primary processing LLM (Flash 1.5).
- `ANTHROPIC_API_KEY`: High-reasoning LLM (Sonnet 3.5).
- `OPENAI_API_KEY`: Vector Embeddings.

### Security
- `ENCRYPTION_KEY_PII`: Used to securely encrypt applicant personal data before storing it in the database.

> See `.env.example` for the complete list of variables and default values.
