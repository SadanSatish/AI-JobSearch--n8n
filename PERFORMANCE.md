# Performance and Memory Optimization

Running n8n efficiently, especially on constrained environments like the Render Free tier (512MB RAM, limited CPU), requires explicit architecture limits.

## 1. Node.js V8 Memory Capping

Node.js will happily consume memory until the OS terminates the process. We use the `--max-old-space-size=384` flag to instruct the V8 Garbage Collector to aggressively free memory once the heap hits 384MB. This prevents Render from killing our container with an Out of Memory (OOM) 137 error code.

## 2. Main Process Execution (`EXECUTIONS_PROCESS=main`)

By default, n8n forks a separate Node.js process to execute each workflow. While this offers excellent isolation, a single forked process can immediately cost 100-150MB of RAM.
We've set `EXECUTIONS_PROCESS: "main"` so workflows share the memory space of the main application thread. This ensures the app can handle concurrent jobs without immediately blowing past the 512MB limit.

## 3. Filesystem Binary Data Storage (`N8N_DEFAULT_BINARY_DATA_MODE=filesystem`)

Workflows that process files, images, or large JSON payloads generate Binary Data. 
If left default, n8n attempts to store this binary data directly into the Neon PostgreSQL database. 
- This slows down PostgreSQL.
- It consumes massive amounts of RAM when the node reads/writes the DB.
We've switched this to `filesystem`. The container now stores files on the local disk (`/home/node/.n8n/binaryData`), saving network bandwidth and database memory.

## 4. Execution Data Pruning (`EXECUTIONS_DATA_PRUNE=true`)

n8n logs every workflow execution to the DB. A high volume of workflows will quickly exhaust free database tiers and slow down queries.
- `EXECUTIONS_DATA_MAX_AGE: 24`: Retains execution logs for only 24 hours.

## Best Practices for Workflows
1. **Avoid massive item lists**: Using "Item Lists" nodes to split big arrays into smaller batches reduces memory pressure.
2. **Disable Execution Logging**: For high-volume webhooks, open the Workflow Settings and set "Save Data on Success" to "None".
