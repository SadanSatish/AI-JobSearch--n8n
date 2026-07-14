-- ==============================================================================
-- 010_dashboard_views.sql
-- Materialized views for high-performance dashboard loading and settings table
-- ==============================================================================

BEGIN;

-- 1. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    preferred_roles JSONB DEFAULT '[]',
    preferred_locations JSONB DEFAULT '[]',
    remote_preference VARCHAR(50) DEFAULT 'ANY', -- REMOTE, HYBRID, ONSITE, ANY
    salary_minimum NUMERIC(12, 2),
    notification_preferences JSONB DEFAULT '{"email": true, "telegram": false, "daily_summary": true}',
    theme VARCHAR(20) DEFAULT 'dark',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Materialized View: KPI Dashboard
-- Aggregates job counts, application stats, and average ATS scores per user
CREATE MATERIALIZED VIEW mv_dashboard_kpis AS
SELECT 
    u.user_id,
    
    -- Jobs Discovery Stats
    COUNT(DISTINCT j.job_id) AS total_jobs_found,
    COUNT(DISTINCT CASE WHEN j.classification = 'APPLY_IMMEDIATELY' THEN j.job_id END) AS high_priority_jobs,
    
    -- Application Stats
    COUNT(DISTINCT a.application_id) AS total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'INTERVIEWING' THEN a.application_id END) AS interview_invitations,
    COUNT(DISTINCT CASE WHEN a.status = 'PREPARED' THEN a.application_id END) AS applications_ready,
    
    -- ATS Stats
    COALESCE(AVG(ats.overall_score), 0)::INTEGER AS avg_ats_score,
    
    -- Success Rate
    CASE 
        WHEN COUNT(DISTINCT a.application_id) = 0 THEN 0
        ELSE ROUND((COUNT(DISTINCT CASE WHEN a.status IN ('INTERVIEWING', 'OFFER') THEN a.application_id END)::NUMERIC / COUNT(DISTINCT a.application_id)::NUMERIC) * 100, 2)
    END AS success_rate

FROM users u
LEFT JOIN jobs j ON TRUE -- Assuming global job pool for now
LEFT JOIN applications a ON u.user_id = a.user_id
LEFT JOIN ats_evaluations ats ON u.user_id = ats.user_id
GROUP BY u.user_id;

-- Create unique index to allow concurrent refreshes
CREATE UNIQUE INDEX idx_mv_dashboard_kpis_user ON mv_dashboard_kpis(user_id);

-- 3. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- ALERT, DEADLINE, SYSTEM
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

COMMIT;
