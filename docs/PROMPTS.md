# Prompt Engineering Directory

Prompts are centrally managed in `backend/src/services/ai/PromptManager.ts`. 

## `parse_resume`
Extracts `skills`, `experience`, and `education` arrays from unstructured text. Strictly requests JSON output.

## `parse_jd`
Extracts `required_skills`, `preferred_skills`, and `experience_years_required` from Job descriptions.

## `ats_score`
Compares `resume_json` against `jd_json`. Evaluates gap analysis and overall score, returning `missing_keywords`.

## `optimize_resume`
Rewrites the summary and bullet points, injecting `missing_keywords` while preserving JSON structure.
