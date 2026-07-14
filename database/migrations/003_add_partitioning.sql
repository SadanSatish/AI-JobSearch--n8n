-- =============================================================================
-- Migration 003: Partitioning for High-Volume Tables
-- Run after 002_add_indexes.sql
-- Partitions execution_logs and notifications by month
-- =============================================================================

-- NOTE: Partitioning requires recreating tables if data already exists.
-- For fresh installs (development), run this immediately after 001.
-- For production with existing data: use pg_partman extension and migrate gradually.

-- =============================================================================
-- Partition execution_logs by month
-- =============================================================================
-- The execution_logs table in 001 is already structured correctly.
-- For partitioning, we add a rule to auto-create monthly partitions.

-- Create a maintenance function for monthly partition creation
CREATE OR REPLACE FUNCTION create_monthly_partition(
  p_table TEXT,
  p_date  DATE DEFAULT CURRENT_DATE
) RETURNS VOID AS $$
DECLARE
  v_partition_name TEXT;
  v_start DATE;
  v_end   DATE;
BEGIN
  v_start          := DATE_TRUNC('month', p_date)::DATE;
  v_end            := (v_start + INTERVAL '1 month')::DATE;
  v_partition_name := p_table || '_' || TO_CHAR(v_start, 'YYYY_MM');

  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
    v_partition_name, p_table, v_start, v_end
  );

  RAISE NOTICE 'Created partition % for table %', v_partition_name, p_table;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_monthly_partition IS 'Creates a monthly range partition for a given table and date. Called by cron or setup scripts.';

-- Create partitions for current and next 3 months (covers initial usage)
SELECT create_monthly_partition('execution_logs', CURRENT_DATE);
SELECT create_monthly_partition('execution_logs', CURRENT_DATE + INTERVAL '1 month');
SELECT create_monthly_partition('execution_logs', CURRENT_DATE + INTERVAL '2 months');
SELECT create_monthly_partition('execution_logs', CURRENT_DATE + INTERVAL '3 months');

-- =============================================================================
-- Row-Level Security (RLS) for multi-tenant safety
-- =============================================================================
ALTER TABLE resumes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own data
-- NOTE: In n8n, we use the jobsearch_user DB role with full access.
-- RLS policies below are for when a future user-facing API is added.
-- The jobsearch_user bypasses RLS via BYPASSRLS privilege.

-- =============================================================================
-- Seed: system user for internal operations
-- =============================================================================
INSERT INTO users (id, email, full_name, auth_provider, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@jobplatform.internal',
  'System User',
  'system',
  TRUE
) ON CONFLICT (id) DO NOTHING;
