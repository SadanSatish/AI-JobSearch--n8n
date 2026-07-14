# Deployment Guide

This platform is engineered to be deployed on **Render** utilizing Docker and static deployment configurations.

## Render Configuration

A `render.yaml` Blueprint is provided at the root of the project to instantly spin up the required services:

1. **jsp-frontend** (Static Site)
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   
2. **jsp-backend** (Docker Web Service)
   - Root Directory: `backend`
   - Dockerfile Path: `../docker/Dockerfile.backend`
   
3. **jsp-n8n** (Docker Private Service)
   - Root Directory: `.`
   - Dockerfile Path: `./docker/Dockerfile.n8n`
   - Persistent Disk: `1GB` mounted at `/home/node/.n8n`

## Steps to Deploy

1. Create a [Render](https://render.com) account.
2. Navigate to **Blueprints** and connect your GitHub repository.
3. Render will automatically parse `render.yaml` and prompt you to input the environment variables defined in `.env.example`.
4. Connect a **Neon PostgreSQL** database and provide the Direct Connection string to `DB_POSTGRESDB_HOST` and associated variables.
5. Provide your **Upstash Redis** and **Qdrant** endpoints.
6. Click **Apply**.

Render will provision and build all services.

> **Note**: To reduce costs, the backend and n8n services are configured for the free tier, which sleeps after 15 minutes of inactivity. For production traffic, upgrade these services in the Render dashboard.
