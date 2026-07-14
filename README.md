# AI Job Search Platform

A comprehensive, Multi-Agent powered Job Search Orchestrator that automates finding, evaluating, and applying to high-quality jobs tailored perfectly to a user's resume and skillset.

## Key Features

- **Multi-Agent Orchestration**: Planner Agent, Search Agent, Quality Evaluation Agent, and ATS Ranking Agent work together to discover and rank jobs using OpenRouter/Gemini.
- **Resume Hub**: Upload PDF resumes, have them instantly parsed by AI, and view granular ATS metrics.
- **Kanban Application Tracker**: Move applications gracefully through Saved, Applied, Interviewing, and Rejected states.
- **n8n Workflow Engine**: Asynchronous job fetching and robust event-driven operations powered by `n8n`.
- **Premium Interface**: Built with React 19, Tailwind CSS v4, and Radix UI primitives.

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Zod, JWT
- **Database**: Neon (PostgreSQL connection pooler optimized)
- **Vector Search / Memory**: Qdrant, Upstash Redis
- **Automation / Tasks**: n8n
- **Infrastructure**: Docker, Docker Compose, Render

## Getting Started

See [INSTALLATION.md](INSTALLATION.md) for local setup instructions.

## Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Security Policies](SECURITY.md)
