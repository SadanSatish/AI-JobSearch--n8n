# Application Pipeline

The final step in the Master Orchestrator generates an `ApplicationPackage`.

## 1. Resume Optimization
The `ApplicationAgent` detects if the `RankingAgent` found `missing_keywords` in the gap analysis. If it did, it passes the Resume to the `OptimizerService`, producing an ATS-compliant rewritten JSON resume.

## 2. Cover Letter Generation
The `CoverLetterAgent` extracts the candidate's core strengths and aligns them with the Job Description's requirements.

## 3. Storage
Packages are saved directly to `applications` with `status: 'draft'`, tracking history in `application_history`.
