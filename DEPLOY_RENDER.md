# Deploying to Render (Free Tier Architecture)

This repository uses a fully automated Render Blueprint (`render.yaml`) configured to operate entirely within Render's Free Tier by offloading persistent storage to specialized free-tier external providers.

## Architecture

- **PostgreSQL**: Hosted on [Neon.tech](https://neon.tech) (Free Tier). Stores n8n internal state and application platform data.
- **Key-Value Store (Redis)**: Hosted on [Upstash](https://upstash.com) (Free Tier). Provides Bull queue and caching for n8n workers.
- **Vector Database**: Hosted on [Qdrant Cloud](https://cloud.qdrant.io) (Free Tier).
- **Backend**: n8n Web Service deployed as a Render Web Service (Free instance).
- **Frontend**: React/Vite Static Site deployed on Render (Free Static Site).

---

## Step 1: Provision External Services

Before deploying the Blueprint, you must set up the external databases.

### 1. Neon PostgreSQL
1. Create a free account at [Neon.tech](https://neon.tech).
2. Create a new project (e.g., `ai-job-platform`).
3. Note your connection string (e.g., `postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb`).
4. Extract the following individual components:
   - **Host**: `ep-cool-darkness-123456.us-east-2.aws.neon.tech`
   - **User**: `user`
   - **Password**: `password`
   - **Database**: `neondb`
   - **Port**: `5432`

### 2. Upstash Redis
1. Create a free account at [Upstash.com](https://upstash.com).
2. Create a new Redis database.
3. Scroll down to the **Connect** section and select **Node.js** or view the generic connection string.
4. Extract your details:
   - **Host**: `upstash-redis-url` (e.g., `eu1-cool-redis-39328.upstash.io`)
   - **Port**: `39328`
   - **Password**: `your_password`

### 3. Qdrant Cloud
1. Create a free cluster on [Qdrant Cloud](https://cloud.qdrant.io).
2. Generate an API Key and copy your Cluster URL.

---

## Step 2: Deploy to Render

1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect this GitHub repository.
4. Render will parse the `render.yaml` file. Because all databases are external, the Blueprint will immediately prompt you to fill in the required `sync: false` environment variables.

### Required Environment Variables

You must paste the credentials you gathered in Step 1 into the Render dashboard:

**Database Variables (from Neon)**
* `DATABASE_URL` (Full connection string)
* `DB_POSTGRESDB_HOST`
* `DB_POSTGRESDB_PORT`
* `DB_POSTGRESDB_USER`
* `DB_POSTGRESDB_PASSWORD`
* `DB_POSTGRESDB_DATABASE`
* *(Repeat these for the `APP_DB_*` variables as well)*

**Redis Variables (from Upstash)**
* `REDIS_URL` (Full connection string)
* `REDIS_HOST`
* `REDIS_PORT`
* `REDIS_PASSWORD`
* *(Repeat these for the `QUEUE_BULL_REDIS_*` variables as well)*

**Vector Store (from Qdrant)**
* `QDRANT_URL`
* `QDRANT_API_KEY`

**Security & API Keys**
* `N8N_BASIC_AUTH_PASSWORD`: A secure password for your n8n dashboard.
* `ENCRYPTION_KEY_PII`: A random string to encrypt data.
* `API_BEARER_TOKEN`: A token used by the frontend to call n8n.
* **LLM / External API Keys**: Provide your keys for `OPENAI_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `SERPAPI_KEY`, `ADZUNA_APP_ID`, and `ADZUNA_APP_KEY`.

---

## Continuous Deployment

Once the initial deployment is successful, any push to the `main` branch will automatically trigger a redeployment of the modified services. The frontend will automatically generate Preview Environments for Pull Requests.
