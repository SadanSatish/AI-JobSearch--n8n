-- ==============================================================================
-- 005_job_discovery.sql
-- Tracking for searched jobs, normalized schema storage, and companies
-- ==============================================================================

BEGIN;

-- 1. Create companies table (dimension table for enrichment)
CREATE TABLE IF NOT EXISTS companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL UNIQUE,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    website VARCHAR(500),
    funding_stage VARCHAR(50),
    remote_friendliness VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_name ON companies(company_name);

-- 2. Create job_search_runs table to track API usage and metadata
CREATE TABLE IF NOT EXISTS job_search_runs (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resume_profiles(resume_id) ON DELETE CASCADE,
    query_type VARCHAR(50) NOT NULL, -- 'job' or 'internship'
    strategies_used JSONB NOT NULL,
    total_raw_results INTEGER NOT NULL DEFAULT 0,
    total_deduplicated INTEGER NOT NULL DEFAULT 0,
    api_calls_made INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create jobs table for the normalized opportunities
CREATE TABLE IF NOT EXISTS jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES job_search_runs(run_id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(company_id) ON DELETE SET NULL,
    
    -- Core
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_status VARCHAR(50), -- remote, hybrid, onsite
    employment_type VARCHAR(50), -- full_time, contract, internship
    
    -- Money & Match
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency VARCHAR(10),
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    
    -- Links & Text
    apply_url VARCHAR(1000) NOT NULL,
    source VARCHAR(100),
    description TEXT,
    
    -- Deduplication Hash (Title + Company)
    dedup_hash VARCHAR(64) NOT NULL,
    
    posted_at TIMESTAMPTZ,
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_job_hash UNIQUE (dedup_hash)
);

CREATE INDEX idx_jobs_run ON jobs(run_id);
CREATE INDEX idx_jobs_score ON jobs(match_score DESC);

COMMIT;
