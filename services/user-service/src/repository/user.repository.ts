import { pool } from "../config/pool.js";
import type { User } from "../models/user.model.js";
import { randomUUID } from "crypto";

class UserRepository {

    async create(
        userId: string, 
        name: string,
        email: string
    ): Promise<User> {

        const result = await pool.query(`
        INSERT INTO users(id, name, email) values ($1, $2, $3) RETURNING *
        `, [userId, name, email]);

        return result.rows[0];
    }

    async findById(id: string): Promise<User | null> {

        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

        if (result.rowCount == 0) {
            return null;
        }

        return result.rows[0];
    }

}

export { UserRepository };