# Architecture Overview

The AI Job Search Platform utilizes a robust, decoupled architecture designed for high scalability, asynchronous processing, and responsive user experiences.

## Core Layers

### 1. Presentation Layer (Frontend)
- **React 19** SPA served statically (via Nginx or Render static).
- Consumes the backend REST API via Axios with interceptors handling JWT refresh and authorization.
- State is managed via `TanStack Query` for server-state caching.

### 2. API Gateway & Business Logic (Backend)
- **Express / Node.js** REST API.
- Handles Authentication, Role Validation, and standard CRUD operations.
- Interacts with PostgreSQL (via `pg` pool) for persistent structured data.
- Interfaces directly with external AI Providers (OpenRouter, Gemini) for quick synchronous LLM tasks.

### 3. Asynchronous Workflow Engine (n8n)
- Processes heavy, long-running tasks such as:
  - Scraping the web for jobs.
  - Large-scale multi-agent reasoning.
  - Periodic resume health-checks.
- Triggered by the Backend via Webhooks.

### 4. Data Layer
- **Relational**: PostgreSQL (Neon) for Users, Resumes, Jobs, and Application states.
- **Cache / Message Queue**: Redis (Upstash) for rate limiting, temporal caching, and inter-service messaging.
- **Vector**: Qdrant for semantic resume-to-job matching embeddings.
