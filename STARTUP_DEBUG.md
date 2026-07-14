# Startup Debugging on Render Free

If n8n continues to fail during startup on the Render Free tier, follow these debugging strategies.

## 1. Monitor the JavaScript Heap (OOM)

Render Free has a strict 512MB RAM limit. If the Node.js V8 engine tries to allocate more memory than this, the container will be killed abruptly (Exit Code 137). 

### Symptoms
- `JavaScript heap out of memory` in the Render logs.
- Container suddenly restarting without an error stack trace.

### The Fix
We use the `NODE_OPTIONS` environment variable to cap the memory.
```yaml
NODE_OPTIONS: "--max-old-space-size=384"
```
This restricts V8 to ~384MB of RAM, leaving ~128MB for the OS and Docker overhead.

## 2. Monitor Database Initialization

n8n runs database migrations automatically on startup using TypeORM.

### Symptoms
- Database ping timeouts.
- TypeORM hanging on startup.

### The Fix
- **Direct Connection:** Ensure you are using the Neon Direct Connection, not the Pooled Connection (i.e., no `-pooler` in your endpoint string). External transaction poolers break TypeORM migration locks.
- Ensure SSL variables are set (`DB_POSTGRESDB_SSL_ENABLED=true`).

## 3. Workflow Startup Execution

If you have workflows with `Cron` or `Polling` triggers that are incredibly heavy, they might fire immediately when n8n boots up, causing a memory spike that crashes the application before it becomes healthy.

### The Fix
- Go into your database (via Neon Console).
- Identify active heavy workflows and manually disable them by setting their `active` column to `false`.
- Restart the Render deployment. 

## 4. Bypassing Internal Forking
n8n natively forks a new Node.js process when executing workflows to isolate them. This costs a massive amount of RAM per execution.
In `render.yaml`, ensure `EXECUTIONS_PROCESS: "main"` is active so workflows run in the main thread.
