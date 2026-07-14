# Version 2.0 Roadmap

With the successful launch of Version 1.0.0 GA, the foundation is set. The following modules are planned for V2.0 and beyond to transform the platform from a personal job search automation tool into a massive SaaS Career OS.

## High Priority (V1.5)

### 1. AI Interview Coach
- **Feature:** Based on the specific Job Description the user applied for, generate 10 highly relevant technical and behavioral interview questions.
- **Architecture:** A new workflow `agent_interview_prep.json` triggered upon an Application Status moving to `INTERVIEWING`. Uses Claude 3.5 Sonnet to cross-reference the Resume JSON with the Job JSON.

### 2. Auto-Apply Scripts (RPA)
- **Feature:** Chrome extensions or Playwright scripts that physically interact with greenhouse.io or lever.co application portals to paste the tailored resume and cover letter fields.
- **Architecture:** Move beyond API scraping and implement true Robotic Process Automation (RPA).

### 3. LinkedIn Profile Optimizer
- **Feature:** Analyze a candidate's LinkedIn profile export and recommend changes to ensure it matches their generated AI Resume.

## Strategic Modules (V2.0)

### 4. SaaS Multi-Tenant Platform
- **Feature:** Transition the system from a single-user or small-team configuration into a massive B2C SaaS platform.
- **Architecture:**
  - Introduce an Auth Provider (e.g., Supabase Auth or Clerk).
  - Add Row-Level Security (RLS) to Postgres so users can never query other users' jobs or resumes.
  - Introduce Stripe billing webhooks inside n8n to charge users for token consumption.

### 5. Recruiter CRM Portal
- **Feature:** A mirrored dashboard for recruiters. Instead of candidates searching for jobs, recruiters search the Qdrant Vector DB for candidates whose embeddings perfectly match their open roles.
- **Architecture:** A separate React frontend (`/frontend-recruiter`) that hits a new set of `api_candidate_search.json` webhooks.

### 6. Kubernetes Migration
- **Feature:** True horizontal scaling.
- **Architecture:** Move away from `docker-compose`. Deploy n8n in `queue` mode with RabbitMQ and 10+ stateless workers to process hundreds of resumes simultaneously during peak SaaS traffic.
