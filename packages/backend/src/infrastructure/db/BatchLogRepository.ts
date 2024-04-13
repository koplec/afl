import pool from "./Database.js";
import { logger } from "../../utils/logger.js";

class BatchLogRepository {
    constructor() {
        logger.info("BatchLogRepository instantiated");
    }

    async startBatch(batchName: string): Promise<number> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO batch_logs (batch_name, start_at) VALUES ($1, NOW()) RETURNING id`,
                [batchName]
            );
            return result.rows[0].id;
        } finally {
            client.release();
        }
    }

    async endBatch(batchId: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('UPDATE batch_logs SET end_at = NOW() WHERE id = $1', [batchId]);
        } finally {
            client.release();
        }
    }

    async errorBatch(batchId: number, memo: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('UPDATE batch_logs SET error_at = NOW(), memo = $2 WHERE id = $1', [batchId, memo]);
        } finally {
            client.release();
        }
    }
}

export default BatchLogRepository;