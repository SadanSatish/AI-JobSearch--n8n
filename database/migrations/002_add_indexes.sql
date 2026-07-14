-- =============================================================================
-- Migration 002: Indexes & Performance
-- Run after 001_initial_schema.sql
-- =============================================================================

-- USERS
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active  ON users(is_active) WHERE is_active = TRUE;

-- RESUMES
CREATE INDEX IF NOT EXISTS idx_resumes_user_id    ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_primary ON resumes(user_id, is_primary) WHERE is_primary = TRUE;

-- RESUME PROFILES
CREATE INDEX IF NOT EXISTS idx_resume_profiles_resume_id ON resume_profiles(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_profiles_user_id   ON resume_profiles(user_id);

-- SKILLS
CREATE INDEX IF NOT EXISTS idx_skills_resume_profile_id ON skills(resume_profile_id);
CREATE INDEX IF NOT EXISTS idx_skills_name              ON skills USING gin(name gin_trgm_ops);

-- EXPERIENCE
CREATE INDEX IF NOT EXISTS idx_experience_resume_profile_id ON experience(resume_profile_id);

-- COMPANIES
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_name_lower ON companies(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_companies_is_verified       ON companies(is_verified);

-- JOBS
CREATE INDEX IF NOT EXISTS idx_jobs_company_id     ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date    ON jobs(posted_date DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_quality_score  ON jobs(quality_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_is_ghost       ON jobs(is_ghost) WHERE is_ghost = FALSE;
CREATE INDEX IF NOT EXISTS idx_jobs_is_scam        ON jobs(is_scam)  WHERE is_scam  = FALSE;
CREATE INDEX IF NOT EXISTS idx_jobs_title_search   ON jobs USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_fetched_at     ON jobs(fetched_at DESC);

-- INTERNSHIPS
CREATE INDEX IF NOT EXISTS idx_internships_company_id  ON internships(company_id);
CREATE INDEX IF NOT EXISTS idx_internships_posted_date ON internships(posted_date DESC NULLS LAST);

-- APPLICATIONS
CREATE INDEX IF NOT EXISTS idx_applications_user_id   ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status    ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id    ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_created   ON applications(created_at DESC);

-- APPLICATION STATUS HISTORY
CREATE INDEX IF NOT EXISTS idx_app_status_history_application_id ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_app_status_history_changed_at     ON application_status_history(changed_at DESC);

-- ATS REPORTS
CREATE INDEX IF NOT EXISTS idx_ats_reports_job_id        ON ats_reports(job_id);
CREATE INDEX IF NOT EXISTS idx_ats_reports_match_score   ON ats_reports(match_score DESC);

-- NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_notifications_user_id   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status    ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created   ON notifications(created_at DESC);

-- EXECUTION LOGS
CREATE INDEX IF NOT EXISTS idx_execution_logs_execution_id ON execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_logged_at    ON execution_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_logs_user_id      ON execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_agent_id     ON execution_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status       ON execution_logs(status);

-- SEARCH HISTORY
CREATE INDEX IF NOT EXISTS idx_search_history_user_id    ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_searched   ON search_history(searched_at DESC);

-- PROMPT VERSIONS
CREATE INDEX IF NOT EXISTS idx_prompt_versions_agent_id  ON prompt_versions(agent_id);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_is_active ON prompt_versions(agent_id, is_active) WHERE is_active = TRUE;

-- EMBEDDINGS
CREATE INDEX IF NOT EXISTS idx_embeddings_entity ON embeddings(entity_type, entity_id);
