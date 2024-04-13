import { PoolClient } from "pg";
import { WebDavFileInfo } from "../../domain/types";
import pool from "./Database.js";

import { logger } from "../../utils/logger.js";

export class FileInfoRepository {
    private client: PoolClient | null;
    constructor() {
        logger.info("FileInfoRepository instantiated");
        this.client = null;
    }

    async saveWebDavFileInfo(
        mstUserResourceId: number,
        { filename, filepath, filesize, lastModified, type, mime }: WebDavFileInfo): Promise<void> {
        logger.info(`saveWebDavFileInfo BEGIN filename:${filename}`);
        if(this.client === null || this.client === undefined){
            this.client = await pool.connect();
        }

        let mimetype = mime ? mime : null;
        try {
            const result = await this.client.query(
                `
                INSERT INTO file_infos 
                (mst_user_resource_id, filepath, filename, filesize, mimetype, last_modified)
                values 
                ($1, $2, $3, $4, $5, $6)
                `,
                [mstUserResourceId, filepath, filename, filesize, mimetype, lastModified]
            )
            // logger.debug("saveWebDavFileInfo result: ", result);
        } catch (e: unknown) {
            logger.error(`Unknown Error ${filename} info save failed: `, e);
        }finally{
            logger.info(`saveWebDavFileInfo END filename:${filename}`);
        }
    }
}