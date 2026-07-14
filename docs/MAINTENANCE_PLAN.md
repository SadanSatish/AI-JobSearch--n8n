# Maintenance Plan (v1.0.0 GA)

This document outlines the strategy for maintaining the AI Job Search Platform.

## 1. Dependency Update Strategy
- **Node.js/React Frontend:** Update dependencies in `frontend/package.json` quarterly. Run `npm audit` monthly to address critical vulnerabilities.
- **Docker Images:** The `docker-compose.prod.yml` uses versioned tags (e.g., `postgres:15-alpine`). Do not use `:latest` for databases in production to prevent accidental major version upgrades.
- **n8n Core:** Before upgrading the `n8nio/n8n` image, always take a full PostgreSQL snapshot. Test the upgrade in a Staging environment to ensure custom JSON workflows remain compatible with the new n8n version.

## 2. LLM Model Migration Strategy
AI models evolve rapidly. When migrating to a new model (e.g., moving from Claude 3.5 Sonnet to Claude 4.0):
1. **Identify Usage:** Search the `workflows/` directory for the specific model string.
2. **Staging Test:** Update the model string in the n8n HTTP Request/OpenAI nodes in a Staging environment.
3. **Prompt Validation:** New models often interpret prompts differently. Run a test batch of 10 Resumes through the `agent_resume_refinement.json` workflow. Ensure the output strictly conforms to the expected JSON schema and that the "Anti-Hallucination" check still passes.
4. **Deploy:** If validation passes, push the updated JSON workflow file to production.

## 3. Database Migration Strategy
When releasing new features that require database changes (e.g., Phase 12 Roadmap items):
1. Create a new sequential migration file in `database/migrations/` (e.g., `012_add_interview_tables.sql`).
2. Include both `UP` (create) and `DOWN` (drop) instructions in your pull request notes for rollback capabilities.
3. Never drop columns that the currently running n8n API webhooks depend on without first deploying the updated n8n workflows that stop querying those columns (Zero-Downtime Migration strategy).

## 4. Cache Expiration Policy
Redis semantic caches (Job Descriptions, Embeddings) are currently set to TTL (Time to Live) of 7 days. If you encounter stale data issues, use the `RUNBOOK.md` instructions to flush Redis manually.
