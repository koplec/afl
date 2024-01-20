-- 001_create_db_revisions_table.sql
CREATE TABLE db_revisions (
    id INTEGER PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);
insert into db_revisions (id, description) values (1, 'create db_revisions table');

-- 002_create_mst_users_table.sql
CREATE TABLE mst_users (
    id SERIAL PRIMARY KEY,
    name varchar(50) UNIQUE NOT NULL,
    password varchar(50) NOT NULL,
    salt varchar(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
insert into db_revisions (id, description) values (2, 'create mst_users table');


INSERT INTO mst_users (name, password, salt) VALUES ('user', 'pass', 'salt');