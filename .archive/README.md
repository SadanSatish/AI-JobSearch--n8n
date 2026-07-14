# 🚀 AI Job & Internship Search Platform (v1.0.0)

An enterprise-grade, fully autonomous career pipeline. This platform ingests resumes, scours the internet for high-quality jobs, algorithmically calculates ATS match scores, automatically rewrites resumes to defeat ATS filters without hallucinating, and generates complete application packages.

## 🏗️ Architecture

- **Orchestration:** n8n (Node-based Agent Execution)
- **Database:** PostgreSQL (with high-performance Materialized Views)
- **Caching & Memory:** Redis (Semantic Cache) & Qdrant (Vector Embeddings)
- **Frontend:** React + Vite + TailwindCSS
- **Reverse Proxy:** Caddy (Auto-SSL, Rate Limiting)
- **AI Models:** Anthropic (Claude 3.5 Sonnet / Haiku), Google (Gemini Flash), OpenAI (Embeddings)

---

## ⚡ Quick Start (Docker)

1. **Clone & Configure:**
```bash
git clone https://github.com/your-org/ai-job-search.git
cd ai-job-search
cp .env.example .env
```
*Edit `.env` to include your `OPENAI_API_KEY` and `OPENROUTER_API_KEY`.*

2. **Spin Up the Production Stack:**
```bash
cd docker
docker compose -f docker-compose.prod.yml up -d
```

3. **Validate Health:**
```bash
bash ../scripts/validate.sh
```

4. **Access the Dashboard:**
Visit `http://localhost` (or your configured `DOMAIN`). Use the `API_BEARER_TOKEN` defined in your `.env` to authenticate.

---

## 📚 Documentation
For detailed architecture deep-dives, see the `docs/` folder:
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Render Deployment Setup](DEPLOY_RENDER.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)
- [Security Architecture](SECURITY.md)
- [Operations Runbook](docs/RUNBOOK.md)
- [QA Validation Report](docs/QA_REPORT.md)
- [Cost Analysis](docs/COST_ANALYSIS.md)
- [Security Audit](docs/SECURITY_AUDIT.md)

## 🤝 Contributing
Please see `CONTRIBUTING.md` (coming soon) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
