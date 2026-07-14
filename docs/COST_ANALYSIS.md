# Cost Analysis & LLM Optimization (v1.0.0 RC1)

## Overview
Operating AI agents at scale can become extremely expensive. This platform leverages a "Tiered Intelligence" architecture to minimize the operating costs per application cycle.

## 1. Model Strategy
- **Heavy Extraction (Phase 3 & 6):** Claude 3.5 Sonnet / GPT-4o. Used strictly for one-off parsing of the user's initial resume and extracting complex Job Description JSON schemas.
- **Fast Generation (Phase 8):** Claude 3 Haiku / Gemini Flash 1.5. Used for generating Cover Letters and Outreach messages. These models are ~90% cheaper but perform excellently on constrained text generation tasks.
- **Embeddings (Phase 6):** `text-embedding-3-small`. Costs $0.02 per 1M tokens.

## 2. Estimated Cost Per Candidate Journey
Assuming a candidate uploads 1 Resume and the system discovers and evaluates 50 Jobs:

| Operation | Model | Tokens | Est. Cost |
|---|---|---|---|
| Resume Parsing | Sonnet 3.5 | 3k IN / 1k OUT | $0.024 |
| Job Quality (Ghost Detection) | Heuristics | N/A | $0.000 |
| ATS Extract (x50) | Haiku 3 | 50k IN / 10k OUT | $0.025 |
| Semantic Embeddings (x50) | text-embed-3-small | 30k IN | $0.001 |
| Resume Tailoring (Top 5) | Haiku 3 | 15k IN / 5k OUT | $0.010 |
| Application Prep (Top 5) | Gemini Flash 1.5 | 10k IN / 2k OUT | $0.005 |
| **TOTAL COST** | | | **~$0.065 per candidate cycle** |

## 3. Cost Mitigation Factors
1. **Redis Caching:** The $0.065 cost drops to nearly **$0.01** if the candidate is applying for popular jobs that the system has already parsed and cached in Redis.
2. **Deterministic Fallbacks:** If the OpenAI embedding API is down or limits are reached, the system falls back to 100% deterministic (free) math based keyword-scoring, ensuring the pipeline never halts while saving money.

**Conclusion:** The platform is highly cost-effective, running complete end-to-end AI pipelines for pennies.
