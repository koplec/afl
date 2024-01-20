import User from "../../domain/User";
import pool from "./Database";

//DBの言葉をドメインの言葉に書き換える
export class UserRepository {
    async getUserByName(username: string): Promise<User | null>{
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM mst_users WHERE name = $1', [username]);
            if(result.rows.length > 0){
                const dbUser = result.rows[0];
                return new User(dbUser.id, dbUser.name, dbUser.password);
            }else{
                return null;
            }
        } finally {
            client.release();
        }
    }
}