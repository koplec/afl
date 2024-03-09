import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'dbname',
    password: 'pass',
    port: 5432,
});

export default pool;