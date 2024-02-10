begin;

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
select * from mst_protocol_types;

insert into db_revisions (id, description) values (3, 'create mst_user_resources and mst_protocol_types table');
rollback;