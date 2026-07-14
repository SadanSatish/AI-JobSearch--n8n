# Multi-Agent Architecture

## Philosophy
To ensure production-ready stability, we moved the heavy orchestration logic away from n8n nodes and directly into a robust Node.js Multi-Agent pipeline. Each agent inherits from `BaseAgent`, which provides automatic logging to the `agent_runs` table, execution timing, and error handling.

## Agents
- **PlannerAgent**: Ingests user preferences and Resume JSON to formulate optimal job board queries.
- **JobSearchAgent**: Takes queries and concurrently queries the `JobConnectorFactory` (LinkedIn, Indeed).
- **JobQualityAgent**: Cleans raw data (detects spam, ghosts, duplicates).
- **RankingAgent**: Applies `ats_score` and semantic matching.
- **ApplicationAgent / CoverLetterAgent**: Rewrites the final ATS-optimized Resume and tailored Cover Letter into an `ApplicationPackage`.
- **MasterOrchestrator**: Ties them all together in sequence.
