import { pool } from "../config/pool.js";
import type { ProcessedEvents } from "../models/processedEvents.model.js";

class ProcessedEventsRepository {

    async create(
        eventId: string,
        eventType: string
    ): Promise<ProcessedEvents> {

        const result = await pool.query(`
            INSERT INTO processed_events(
                event_id,
                event_type
            )
            VALUES ($1, $2)
            RETURNING *
        `, [eventId, eventType]);

        return {
            eventId: result.rows[0].event_id,
            eventType: result.rows[0].event_type,
            processedAt: result.rows[0].processed_at
        };
    }


    async findByEventId(
        eventId: string
    ): Promise<ProcessedEvents | null> {

        const result = await pool.query(`
            SELECT *
            FROM processed_events
            WHERE event_id = $1
        `, [eventId]);


        if (result.rowCount === 0) {
            return null;
        }


        return {
            eventId: result.rows[0].event_id,
            eventType: result.rows[0].event_type,
            processedAt: result.rows[0].processed_at
        };
    }

}

export { ProcessedEventsRepository };