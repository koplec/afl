-- # 001_create_db_revisions_table.sql
CREATE TABLE db_revisions (
    id INTEGER PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);
insert into db_revisions (id, description) values (1, 'create db_revisions table');

-- # 002_create_mst_users_table.sql
CREATE TABLE mst_users (
    id SERIAL PRIMARY KEY,
    name varchar(50) UNIQUE NOT NULL,
    password varchar(50) NOT NULL,
    salt varchar(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
insert into db_revisions (id, description) values (2, 'create mst_users table');

-- # 003_create_mst_user_resources_table_mst_protocol_table.sql

CREATE TABLE IF NOT EXISTS mst_protocol_types (
    id INTEGER PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'SMB', 'WEBDAV', 'SFTP'な
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mst_user_resources (
    id SERIAL PRIMARY KEY,
    mst_user_id INT NOT NULL,
    mst_protocol_type_id INT NOT NULL,
    connection_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mst_user_id) REFERENCES mst_users(id),
    FOREIGN KEY (mst_protocol_type_id) REFERENCES mst_protocol_types(id)
);

-- mst_protocol_typesテーブルとそのカラムにコメントを追加
COMMENT ON TABLE mst_protocol_types IS 'プロトコルの種類を管理するテーブル';
COMMENT ON COLUMN mst_protocol_types.id IS 'プライマリーキー';
COMMENT ON COLUMN mst_protocol_types.type IS 'プロトコルの種類（SMB, WEBDAV, SFTPなど）';
COMMENT ON COLUMN mst_protocol_types.created_at IS 'レコードの作成日時';
COMMENT ON COLUMN mst_protocol_types.updated_at IS 'レコードの更新日時';

-- mst_user_resourcesテーブルとそのカラムにコメントを追加
COMMENT ON TABLE mst_user_resources IS 'ユーザーがアクセス可能なリソースを管理するテーブル';
COMMENT ON COLUMN mst_user_resources.id IS 'プライマリーキー';
COMMENT ON COLUMN mst_user_resources.mst_user_id IS 'mst_usersテーブルへの外部キー';
COMMENT ON COLUMN mst_user_resources.mst_protocol_type_id IS 'mst_protocol_typesテーブルへの外部キー';
COMMENT ON COLUMN mst_user_resources.connection_details IS '接続詳細をJSON形式で保存';
COMMENT ON COLUMN mst_user_resources.created_at IS 'レコードの作成日時';
COMMENT ON COLUMN mst_user_resources.updated_at IS 'レコードの更新日時';

-- init data of mst_protocol_types 
INSERT INTO mst_protocol_types (id, type) VALUES (1, 'SMB');
INSERT INTO mst_protocol_types (id, type) VALUES (2, 'WEBDAV');
insert into db_revisions (id, description) values (3, 'create mst_user_resources and mst_protocol_types table');


-- # 004_create_file_infos_table.sql
CREATE TABLE file_infos (
    id SERIAL PRIMARY KEY,
    mst_user_resource_id INT NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filesize BIGINT NOT NULL,
    mimetype VARCHAR(255) NULL,
    file_created TIMESTAMPTZ NULL,
    last_modified TIMESTAMPTZ NULL,
    md5_hash VARCHAR(32) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mst_user_resource_id) REFERENCES mst_user_resources(id),
    UNIQUE (mst_user_resource_id, filepath, filename)
);


-- mst_file_infosテーブルとそのカラムにコメントを追加

COMMENT ON TABLE file_infos IS 'Table for storing file information';

COMMENT ON COLUMN file_infos.id IS 'Primary key';
COMMENT ON COLUMN file_infos.mst_user_resource_id IS 'Foreign key referencing mst_user_resources';
COMMENT ON COLUMN file_infos.filepath IS 'Path of the file without filename';
COMMENT ON COLUMN file_infos.filename IS 'Name of the file , basename';
COMMENT ON COLUMN file_infos.filesize IS 'Size of the file in bytes';
COMMENT ON COLUMN file_infos.mimetype IS 'MIME type of the file';
COMMENT ON COLUMN file_infos.file_created IS 'Creation date of the file';
COMMENT ON COLUMN file_infos.last_modified IS 'Last modification date of the file';
COMMENT ON COLUMN file_infos.md5_hash IS 'MD5 hash of the file';
COMMENT ON COLUMN file_infos.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN file_infos.updated_at IS 'Record update timestamp';


insert into db_revisions (id, description) values (4, 'create mst_file_infos table');


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

--- sample data ---
INSERT INTO mst_users (name, password, salt) VALUES ('user', 'pass', 'salt');
INSERT INTO mst_user_resources (mst_user_id, mst_protocol_type_id, connection_details)
VALUES (
    1,  -- userユーザ
    2,  -- ここに適切なプロトコルタイプIDを設定します
    '{
        "version": "1.0",
        "webdav_url": "http://your-webdav-host.com:port",
        "webdav_username": "username",
        "webdav_password": "password",
        "webdav_directory": "/path/to/directory"
    }'::jsonb
);