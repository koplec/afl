import { UserResourceType } from "../../domain/types";
import pool from "./Database";


export class UserResourceRepository {
    async getUserResource(userId: number, resourceId: number):Promise<UserResourceType|null>{
        const client = await pool.connect();
        try {
            const result = await client.query(
                `
                SELECT 
                    mst_user_resources.id as id,
                    mst_user_resources.mst_user_id as user_id,
                    mst_protocol_types.type as type,
                    mst_user_resources.connection_details as connection_details
                FROM mst_user_resources 
                left outer join mst_protocol_types 
                on mst_user_resources.mst_protocol_type_id = mst_protocol_types.id
                WHERE mst_user_resources.id = $1 AND mst_user_resources.mst_user_id = $2 `,
                [resourceId, userId]
            );
            if(result.rows.length > 0){
                const r = result.rows[0];
                switch(r["type"]){
                    case "WEBDAV":
                        const details = r["connection_details"];
                        return {
                            id: r.id,
                            userId: r.user_id,
                            protocolType: r["type"],
                            url: details["webdav_url"],
                            username: details["webdav_username"],
                            password: details["webdav_password"]
                        }
                    default:
                        return null;
                }
            }else{
                return null;
            }
        }catch(e){
            console.error(e);
            return null;
        } finally {
            client.release();
        }
    }
}