import { UserResourceType } from "../../domain/types";
import pool from "./Database.js";

type WEBDAVDetailType = {
    version: "1.0";
    webdav_url: string;
    webdav_username: string;
    webdav_password: string;
    webdav_directory: string;
};

export const CREATE_USER_WEB_DAV_RESOURCE_FAILED = -1;

export class UserResourceRepository {
    constructor() {
        console.log("UserResourceRepository instantiated");
    }
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
                            password: details["webdav_password"],
                            directory: details["webdav_directory"]
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

    async getUserResources(userId: number):Promise<UserResourceType[]>{
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
                WHERE mst_user_resources.mst_user_id = $1`,
                [userId]
            );
            if(result.rows.length > 0){
                let ary:UserResourceType[] = [];
                result.rows.forEach(r => {
                    switch(r["type"]){
                        case "WEBDAV":
                            const details = r["connection_details"];
                            ary.push({
                                id: r.id,
                                userId: r.user_id,
                                protocolType: "WEBDAV" ,
                                url: details["webdav_url"],
                                username: details["webdav_username"],
                                password: details["webdav_password"],
                                directory: details["webdav_directory"]
                            });
                        default:
                            //do nothing
                    }
                });
                return ary;
            }else{
                return [];
            }
        }catch(e){
            console.error(e);
            return [];
        } finally {
            client.release();
        }
    }

    async updateUserWEBDavResource(userId: number, resourceId: number, 
        webdavUrl:string , webdavUsername:string, webdavPassword:string, webdavDirectory:string):Promise<boolean>{
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const select = await client.query(
                `
                SELECT *
                FROM mst_user_resources
                WHERE id = $1 AND mst_user_id = $2
                `, [resourceId, userId]);
            if(select.rows.length === 0){
                await client.query('ROLLBACK');
                return false;
            }

            const connectionDetails:WEBDAVDetailType = {
                version: "1.0",
                webdav_url: webdavUrl,
                webdav_username: webdavUsername,
                webdav_password: webdavPassword,
                webdav_directory: webdavDirectory
            };
            const resource = JSON.stringify(connectionDetails);
            const result = await client.query(
                `
                UPDATE mst_user_resources
                SET connection_details = $1, 
                updated_at = now()
                WHERE id = $2 AND mst_user_id = $3
                `,
                [resource, resourceId, userId]
            );
            if(result.rowCount === 1){
                await client.query('COMMIT');
                return true;
            }else{
                await client.query('ROLLBACK');
                return false;           
            }

        }catch(e){
            console.error(e);
            await client.query('ROLLBACK');
            return false;
        } finally {
            client.release();
        }
    }

    

    async createUserWEBDavResource(userId: number, 
        webdavUrl:string , webdavUsername:string, 
        webdavPassword:string, webdavDirectory:string):Promise<number>{

        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            const select = await client.query(
                `
                SELECT *
                FROM mst_users
                WHERE id = $1
                `, [userId]);
            if(select.rows.length === 0){
                await client.query('ROLLBACK');
                return CREATE_USER_WEB_DAV_RESOURCE_FAILED;
            }
            const connectionDetails:WEBDAVDetailType = {
                version: "1.0",
                webdav_url: webdavUrl,
                webdav_username: webdavUsername,
                webdav_password: webdavPassword,
                webdav_directory: webdavDirectory
            };
            const resource = JSON.stringify(connectionDetails);
            const result = await client.query(
                `
                INSERT INTO mst_user_resources
                (mst_user_id, mst_protocol_type_id, connection_details, created_at, updated_at)
                VALUES($1, (SELECT id FROM mst_protocol_types WHERE type = 'WEBDAV'), $2, now(), now())
                RETURNING id
                `, [userId, resource]
            );
            if(result.rowCount === 1){
                await client.query('COMMIT');
                return result.rows[0].id;
            }else{
                await client.query('ROLLBACK');
                return CREATE_USER_WEB_DAV_RESOURCE_FAILED;
            }
        }catch(e){
            console.error(e);
            await client.query('ROLLBACK');
            return CREATE_USER_WEB_DAV_RESOURCE_FAILED;
        }finally{
            client.release();
        }
    }

    async deleteUserResource(userId: number, resourceId: number):Promise<boolean>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            //check user exists or not 
            const selectUser = await client.query(
                `
                SELECT *
                FROM mst_users
                WHERE id = $1
                `, [userId]);
            if(selectUser.rows.length === 0){
                await client.query('ROLLBACK');
                return false;
            }

            const select = await client.query(
                `
                SELECT *
                FROM mst_user_resources
                WHERE id = $1 AND mst_user_id = $2
                `, [resourceId, userId]);
            if(select.rows.length === 0){
                await client.query('ROLLBACK');
                return false;
            }
            const result = await client.query(
                `
                DELETE FROM mst_user_resources
                WHERE id = $1 AND mst_user_id = $2
                `, [resourceId, userId]
            );
            if(result.rowCount === 1){
                await client.query('COMMIT');
                return true;
            }else{
                await client.query('ROLLBACK');
                return false;
            }
        }catch(e){
            console.error(e);
            await client.query('ROLLBACK');
            return false;
        }finally{
            client.release();
        }
    }
}