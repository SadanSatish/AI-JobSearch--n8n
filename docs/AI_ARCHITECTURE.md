# AI Intelligence Layer Architecture

## Core Services

- **AiProviderService**: Standardized wrapper around `openai` (OpenRouter API) and `@google/generative-ai` (Gemini SDK). Intercepts duplicate calls with Redis.
- **PromptManager**: Registry of prompts, handles schema enforcement (via Zod) and dynamic parameter injection.
- **ResumeParser / JdParser**: Text extraction from PDFs and Docs, subsequently passed through the PromptManager to generate structured JSON logic.
- **QdrantService**: Uses Qdrant Cloud via the `@qdrant/js-client-rest` SDK to interface with `jobsearch_vectors`. Embeddings are executed by Gemini/OpenAI depending on the `.env` settings.
- **AtsService**: Calculates overlaps in `skills` and `experience` arrays from JSON schemas, executing AI Gap Analysis.
- **OptimizerService**: Executes ATS gap-fills dynamically, pushing rewritten bullet points to the `resume_versions` DB table.
