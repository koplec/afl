import { Pool } from "pg";

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'dbname',
    password: 'pass',
    port: 5432,
});

export default pool;