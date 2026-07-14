-- ============================================================================
-- Phase 4: Jobs and Multi-Agent Schema
-- ============================================================================

-- ============================================================================
-- 1. Companies
-- ============================================================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    logo_url TEXT,
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, domain)
);

CREATE INDEX idx_companies_name ON companies(name);

-- ============================================================================
-- 2. Jobs
-- ============================================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    external_job_id VARCHAR(255), -- ID from LinkedIn/Indeed etc
    source_platform VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_status VARCHAR(50), -- remote, hybrid, onsite
    employment_type VARCHAR(50),
    salary_range VARCHAR(100),
    raw_description TEXT,
    parsed_requirements JSONB,
    application_url TEXT,
    posted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_scam_or_ghost BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(external_job_id, source_platform)
);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);

-- ============================================================================
-- 3. Search History (Queries ran by JobSearchAgent)
-- ============================================================================
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query_params JSONB NOT NULL,
    platforms JSONB NOT NULL,
    jobs_found INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);

-- ============================================================================
-- 4. Saved Jobs & Rankings
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL, -- Which resume was used to rank
    ats_score NUMERIC(5, 2),
    semantic_score NUMERIC(5, 2),
    overall_rank_score NUMERIC(5, 2),
    status VARCHAR(50) DEFAULT 'saved', -- saved, applied, rejected, interviewing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);

-- ============================================================================
-- 5. Applications (Compiled Packages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    saved_job_id UUID NOT NULL REFERENCES saved_jobs(id) ON DELETE CASCADE,
    optimized_resume_id UUID REFERENCES resume_versions(id),
    cover_letter TEXT,
    interview_prep_notes TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. Application History
-- ============================================================================
CREATE TABLE IF NOT EXISTS application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. Agent Runs (Monitoring & Logs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    payload JSONB,
    result JSONB,
    status VARCHAR(50) DEFAULT 'running', -- running, success, failed
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agent_runs_user_id ON agent_runs(user_id);

-- ============================================================================
-- 8. Workflow Logs (n8n Webhook History)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workflow_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Update Timestamp Triggers
-- ============================================================================
CREATE TRIGGER set_timestamp_companies BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_jobs BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_saved_jobs BEFORE UPDATE ON saved_jobs FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_applications BEFORE UPDATE ON applications FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
