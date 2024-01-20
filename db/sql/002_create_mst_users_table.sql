begin;
CREATE TABLE mst_users (
    id SERIAL PRIMARY KEY,
    name varchar(50) UNIQUE NOT NULL,
    password varchar(50) NOT NULL,
    salt varchar(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

insert into db_revisions (id, description) values (2, 'create mst_users table');
commit;