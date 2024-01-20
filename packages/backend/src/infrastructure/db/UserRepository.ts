import pool from "./Database";

export class UserRepository {
    async getUserByName(username: string){
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM mst_users WHERE name = $1', [username]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}