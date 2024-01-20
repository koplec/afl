begin;
CREATE TABLE db_revisions (
    id INTEGER PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

insert into db_revisions (id, description) values (1, 'create db_revisions table');
commit;