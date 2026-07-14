# Setup Instructions

## Prerequisites
- Node.js 22.x
- Docker & Docker Compose
- API Keys for Neon, Upstash, and Qdrant

## Local Development
1. Copy `.env.example` to `.env` and fill in credentials.
2. Run `docker compose -f docker-compose.dev.yml up -d` to start the backend, n8n, and DB.
3. In a new terminal, run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
