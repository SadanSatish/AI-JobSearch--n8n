# Security Audit Report (v1.0.0 RC1)

## Overview
This document outlines the security posture of the AI Job Search Platform, ensuring candidate data remains secure and API limits are protected.

## 1. Infrastructure Security
- **Network Isolation:** In `docker-compose.prod.yml`, Postgres, Redis, Qdrant, and the n8n execution engine do *not* publish ports to the host machine. They are completely sandboxed on the `internal` Docker bridge network.
- **Reverse Proxy:** A Caddy reverse proxy handles all external traffic. It automatically enforces `HTTPS` (TLS 1.3) and acts as the sole ingress point.

## 2. Application Security
- **API Authentication:** Every webhook interacting with the React UI enforces Bearer token authentication via a strict n8n Code Node middleware (`if (token !== Bearer $env.API_BEARER_TOKEN) throw 401`). 
- **Internal UI Protection:** The n8n administration interface is protected by a hashed password embedded in the Caddyfile (`basicauth`), preventing public internet access to the workflow builder.
- **Rate Limiting:** The Caddyfile enforces a hard limit of `100 requests per minute` on the `/webhook/api/*` namespace to prevent malicious token-burning or DDoS attacks.

## 3. Data Privacy & Integrity
- **No Hallucinations:** The Resume Optimization prompts (`v1.0.0`) are mathematically sandboxed. A deterministic JavaScript validator (`util_resume_optimizer.json`) verifies that the LLM has not hallucinated past employers or degrees before saving the resume.
- **SQL Injection:** All database nodes in n8n use Parameterized Queries (`$1, $2, $3`) ensuring SQL injection is functionally impossible.

## 4. Secret Management
- **Environment Variables:** No secrets (OpenAI keys, DB passwords) are committed to version control. Everything relies on the `.env` file passing variables dynamically into the Docker containers.

**Status:** PASS. No critical vulnerabilities found.
