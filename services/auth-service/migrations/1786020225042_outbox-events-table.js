/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("outbox_events", {
        outbox_id: {
            type: "string",
            primaryKey: true,
        },
        event_domain: {
            type: "string",
            notNull: true
        },
        aggregate_id: {
            type: "string",
            notNull: false
        },
        payload: {
            type: "jsonb",
            notNull: true
        },
        status: {
            type: "varchar(20)",
            notNull: true,
            default: "PENDING"
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("outbox_events");
};
