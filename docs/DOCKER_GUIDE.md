# Docker Guide

This document explains the custom Dockerfiles and optimizations used in this project.

## `.dockerignore`
An optimized `.dockerignore` prevents `node_modules`, git history, logs, and sensitive `.env` files from being copied into images, drastically reducing build times and image sizes.

## `Dockerfile.n8n`
Instead of using standard volume mounts which are poorly supported on PaaS platforms like Render, we use a custom multi-stage build.

**Why?**
1. **Stateless Workflows:** `COPY ./workflows /home/node/workflows` bakes the pre-built logic into the image.
2. **Permissions:** We run as `root` temporarily to configure directories, and switch back to `node` for security.
3. **Execution Data:** Only execution logs and binary data require a persistent volume mount (`/home/node/.n8n`), minimizing persistent disk requirements.

## `Dockerfile.qdrant`
We build a custom Qdrant image simply to inject `production.yaml` into the image at build time, ensuring no external volumes are required for configuration files.

## Frontend
The frontend does **not** use Docker in production (Render). Instead, we use a Node build script and serve it as a static site. This is significantly faster, cheaper (free), and handles caching perfectly.
