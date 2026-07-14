# Job Search Platform (JSP)

Phase 1 infrastructure rebuild. This project separates concerns into a modular React frontend, a Node.js backend proxy, and an n8n orchestration engine backed by PostgreSQL and Redis.

## Modules
- `frontend/`: React + Vite + Tailwind v4 UI
- `backend/`: Express + Node.js Proxy & Config Loader
- `docker/`: Build recipes and configurations
- `database/`: Schema schemas, migrations, and seeders
- `.archive/`: Legacy business logic workflows

See `docs/PROJECT_STRUCTURE.md` for a full breakdown.
