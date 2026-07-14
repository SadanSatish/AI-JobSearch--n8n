# Project Structure

```
.
├── backend/                  # Node.js + Express Backend Proxy
│   ├── src/                  # Source files
│   └── package.json
├── config/                   # Global configuration JSONs
├── database/                 # Database Layer
│   ├── migrations/           # SQL Up/Down migrations
│   ├── schemas/              # Table definitions
│   └── seeds/                # Dummy data for local dev
├── docker/                   # Docker Build Definitions
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── Dockerfile.n8n
├── docs/                     # Documentation
├── frontend/                 # React + Vite Frontend SPA
│   ├── src/
│   │   ├── api/              # Axios clients
│   │   ├── components/       # Reusable UI
│   │   ├── routes/           # React Router Views
│   │   └── theme/            # Tailwind/CSS constants
│   └── package.json
├── n8n/                      # n8n specific local configs
├── scripts/                  # CI/CD and utility shell scripts
├── shared/                   # Shared types (Zod schemas) across FE/BE
├── .env.example              # Secret definitions
├── docker-compose.yml        # Prod Compose definition
└── render.yaml               # Render Infrastructure as Code Blueprint
```
