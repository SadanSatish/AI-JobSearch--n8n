# ATS Engine Specification

The ATS Engine strictly evaluates structured JSON candidates.

## 1. Requirements Matching
The primary score is derived from matching the array of `required_skills` in the Job Description against the `skills` array in the Resume.

## 2. Gap Analysis
The LLM evaluates the contextual use of the missing keywords. 
If the Resume lacks `keywordX`, it is appended to the `missing_keywords` array for the Optimizer to consume.

## 3. Experience Evaluation
The duration and bullet points in the `experience` array are scored semantically against the responsibilities in the JD.
