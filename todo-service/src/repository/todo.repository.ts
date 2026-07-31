import { randomUUID } from "node:crypto";
import { pool } from "../config/pool.js";
import type { Todo } from "../models/todo.model.js";

class TodoRepository {

    async create(
        title: string,
        userId: string
    ): Promise<Todo> {

        const result = await pool.query(
            `
            INSERT INTO todos(id, title, user_id)
            VALUES($1, $2, $3)
            RETURNING *
            `,
            [randomUUID(), title, userId]
        );

        const row = result.rows[0];

        return this.mapRow(row);
    }


    async findById(id: string): Promise<Todo | null> {

        const result = await pool.query(
            `
            SELECT *
            FROM todos
            WHERE id = $1
            `,
            [id]
        );

        if (!result.rows[0]) {
            return null;
        }

        return this.mapRow(result.rows[0]);
    }


    async findByUserId(userId: string): Promise<Todo[]> {

        const result = await pool.query(
            `
            SELECT *
            FROM todos
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return result.rows.map(this.mapRow);
    }


    async updateStatus(
        id: string,
        status: boolean
    ): Promise<Todo | null> {

        const result = await pool.query(
            `
            UPDATE todos
            SET status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );


        if (!result.rows[0]) {
            return null;
        }

        return this.mapRow(result.rows[0]);
    }


    async delete(id: string): Promise<boolean> {

        const result = await pool.query(
            `
            DELETE FROM todos
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount !== 0;
    }


    private mapRow(row: any): Todo {
        return {
            id: row.id,
            title: row.title,
            status: row.status,
            userId: row.user_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}


export { TodoRepository };