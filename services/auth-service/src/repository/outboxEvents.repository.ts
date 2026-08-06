import { pool } from "../config/pool.js";

class OutboxRepository {

    async create(
        outboxId: string,
        eventDomain: string,
        aggregateId: string,
        payload: object
    ) {

        const result = await pool.query(`
            INSERT INTO outbox_events(
                outbox_id,
                event_domain,
                aggregate_id,
                payload
            )
            VALUES($1,$2,$3,$4)
            RETURNING *
        `,
            [
                outboxId,
                eventDomain,
                aggregateId,
                payload
            ]);

        return result.rows[0];
    }


    async findPending() {

        const result = await pool.query(`
            SELECT *
            FROM outbox_events
            WHERE status='PENDING'
            ORDER BY created_at
            LIMIT 100
        `);

        return result.rows;
    }


    async markPublished(
        id: string
    ) {

        await pool.query(`
            UPDATE outbox_events
            SET status='PUBLISHED'
            WHERE outbox_id=$1
        `,
            [id]);
    }
}


export { OutboxRepository };