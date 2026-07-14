# Local Deployment Guide

To run the platform locally for development and testing, use the included Docker Compose files.

## Prerequisites
- Docker Engine & Docker Compose
- Node.js 18+ (if running frontend locally outside Docker)

## Setup

1. **Environment Variables**
   ```bash
   cp .env.example docker/.env
   # Edit docker/.env and add your API keys
   ```

2. **Start the Stack**
   ```bash
   cd docker
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Development Mode (with pgAdmin)**
   If you need a GUI for the database, use the `dev` profile:
   ```bash
   cd docker
   docker compose -f docker-compose.yml --profile dev up -d
   ```
   pgAdmin will be available at `http://localhost:5050`.

4. **Validation**
   Run the validation script to ensure all services are healthy:
   ```bash
   ./scripts/validate.sh
   # Or on Windows:
   .\scripts\validate.ps1
   ```

## Local URLs
- **Frontend**: http://localhost
- **n8n Orchestrator**: http://localhost:5678
- **pgAdmin**: http://localhost:5050 (dev profile only)
