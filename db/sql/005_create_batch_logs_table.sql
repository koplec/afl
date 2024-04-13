begin;

-- # 005_create_batch_logs_table.sql
CREATE TABLE batch_logs (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(255) NOT NULL,
    start_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMPTZ,
    error_at TIMESTAMPTZ,
    memo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE batch_logs IS 'Table for storing batch process logs';
COMMENT ON COLUMN batch_logs.id IS 'Primary key';
COMMENT ON COLUMN batch_logs.batch_name IS 'Name of the batch process';
COMMENT ON COLUMN batch_logs.start_at IS 'Start time of the batch process';
COMMENT ON COLUMN batch_logs.end_at IS 'End time of the batch process';
COMMENT ON COLUMN batch_logs.error_at IS 'Time when an error occurred during the batch process';
COMMENT ON COLUMN batch_logs.memo IS 'Additional notes about the batch process';
COMMENT ON COLUMN batch_logs.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN batch_logs.updated_at IS 'Record update timestamp';

insert into db_revisions (id, description) values (5, 'create batch_logs table');

commit;