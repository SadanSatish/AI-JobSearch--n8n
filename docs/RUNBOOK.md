# Operations Runbook

## 1. Monitoring Token Usage and Costs
Token caching is heavily reliant on Redis. If you suspect LLM costs are spiking:
1. SSH into the server.
2. Check Redis hit rates: `docker exec -it <redis-container> redis-cli info stats`
3. Look for `keyspace_hits` vs `keyspace_misses`. If misses are high, ensure the `util_jd_intelligence.json` caching logic hasn't been bypassed.

## 2. Handling API Rate Limits
If n8n starts failing due to OpenAI or Anthropic rate limits:
1. The global error handler (`agent_error_handler.json`) will catch the 429 error and ping the configured Telegram Ops channel.
2. The orchestrators (`agent_job_search`, `agent_application`) are configured with retry logic (exponential backoff). No manual intervention is typically required unless the account is out of credits.

## 3. Database Backups
PostgreSQL runs entirely inside Docker. To take a manual backup:
```bash
docker exec -t <postgres-container> pg_dumpall -c -U jobsearch_user > backup_`date +%Y-%m-%d`.sql
```
To restore:
```bash
cat backup_YYYY-MM-DD.sql | docker exec -i <postgres-container> psql -U jobsearch_user -d jobsearch
```

## 4. Clearing the Caches
If stale job data is breaking the dashboard, clear the Redis cache safely:
```bash
docker exec -it <redis-container> redis-cli flushall
```
*(Note: This will force the LLMs to re-evaluate job descriptions on the next pipeline run).*

## 5. Horizontal Scaling (Future Kubernetes Path)
Currently, n8n is running in `main` mode. For V2.0, to support thousands of users:
1. Switch n8n to `queue` mode.
2. Deploy RabbitMQ.
3. Spin up multiple `n8n-worker` stateless containers to process resumes in parallel.
4. Scale out the Postgres database using read replicas for the frontend `MATERIALIZED VIEWS`.
