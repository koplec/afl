begin;

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
commit;