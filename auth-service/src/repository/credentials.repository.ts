import { pool } from "../config/pool.js";
import type { Credentials } from "../models/credentials.model.js";

class CredentialsRepository {


    async create(
        credentials: Credentials
    ): Promise<Credentials> {

        const query = `
            INSERT INTO credentials
            (
                user_id,
                email,
                password_hash,
                created_at
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *
        `;


        const values = [
            credentials.userId,
            credentials.email,
            credentials.passwordHash,
            credentials.createdAt
        ];


        const result =
            await pool.query(
                query,
                values
            );


        return this.mapRow(result.rows[0]);
    }



    async findByEmail(
        email: string
    ): Promise<Credentials | null> {


        const query = `
            SELECT *
            FROM credentials
            WHERE email=$1
        `;


        const result =
            await pool.query(
                query,
                [email]
            );


        if (result.rows.length === 0) {
            return null;
        }


        return this.mapRow(result.rows[0]);
    }



    async findByUserId(
        userId: string
    ): Promise<Credentials | null> {


        const query = `
            SELECT *
            FROM credentials
            WHERE user_id=$1
        `;


        const result =
            await pool.query(
                query,
                [userId]
            );


        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRow(result.rows[0]);
    }

    async deleteById(userId: string) {
        await pool.query(`DELETE FROM credentials WHERE user_id = $1`, [userId]);
    }

    private mapRow(row: any): Credentials {

        return {
            userId: row.user_id,
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at
        };

    }

}


export { CredentialsRepository };