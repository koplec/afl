begin;

-- # 004_create_mst_file_infos_table.sql
CREATE TABLE mst_file_infos (
    id SERIAL PRIMARY KEY,
    mst_user_resource_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    creation_date TIMESTAMPTZ NOT NULL,
    last_modified_date TIMESTAMPTZ NOT NULL,
    md5_hash VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mst_user_resource_id) REFERENCES mst_user_resources(id)
);

COMMENT ON TABLE mst_file_infos IS 'ファイル情報を管理するテーブル';
COMMENT ON COLUMN mst_file_infos.id IS 'プライマリーキー';
COMMENT ON COLUMN mst_file_infos.mst_user_resource_id IS 'mst_user_resourcesテーブルへの外部キー';
COMMENT ON COLUMN mst_file_infos.file_path IS 'ファイルのパス';
COMMENT ON COLUMN mst_file_infos.file_name IS 'ファイル名';
COMMENT ON COLUMN mst_file_infos.file_size IS 'ファイルサイズ（バイト）';
COMMENT ON COLUMN mst_file_infos.creation_date IS 'ファイルの作成日';
COMMENT ON COLUMN mst_file_infos.last_modified_date IS 'ファイルの最終更新日';
COMMENT ON COLUMN mst_file_infos.md5_hash IS 'ファイルのMD5ハッシュ';
COMMENT ON COLUMN mst_file_infos.created_at IS 'レコードの作成日時';
COMMENT ON COLUMN mst_file_infos.updated_at IS 'レコードの更新日時';

insert into db_revisions (id, description) values (4, 'create mst_file_infos table');
rollback;