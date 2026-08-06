import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { generateToken } from "../utils/jwt.js";
import { CredentialsRepository } from "../repository/credentials.repository.js";
import { UserClient } from "../clients/user.client.js";
import { publish } from "../clients/producer.js";
import { OutboxRepository } from "../repository/outboxEvents.repository.js";
import { pool } from "../config/pool.js";



class AuthService {


    private credentialsRepository: CredentialsRepository;
    private userClient: UserClient;
    private outboxRepository: OutboxRepository;

    constructor() {
        this.credentialsRepository = new CredentialsRepository();
        this.userClient = new UserClient();
        this.outboxRepository = new OutboxRepository();
    }

    async register(name: string, email: string, password: string) {

        const existing =
            await this.credentialsRepository
                .findByEmail(email);


        if (existing) {
            throw new Error(
                "Email already registered"
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        let credentials;

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            credentials =
                await this.credentialsRepository.create(
                    {
                        userId: randomUUID(),
                        email,
                        passwordHash,
                        createdAt: new Date()
                    }
                );


            await this.outboxRepository.create(
                randomUUID(),
                "user-events",
                credentials.userId,
                {
                    eventId: randomUUID(),
                    eventType: "UserCreated",
                    userId: credentials.userId,
                    email: credentials.email,
                    name: name,
                    createdAt: credentials.createdAt
                }
            );


            await client.query("COMMIT");


        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {

            client.release();

        }

        return {
            userId: credentials.userId,
            email: credentials.email
        };

    }


    async login(email: string, password: string) {


        // Find user

        const credentials =
            await this.credentialsRepository.findByEmail(email);

        if (!credentials) {
            throw new Error(
                "Invalid credentials"
            );
        }

        const valid = await bcrypt.compare(password, credentials.passwordHash);

        if (!valid) {
            throw new Error(
                "Invalid credentials"
            );
        }


        const token = generateToken({
            userId: credentials.userId,
            email: credentials.email
        });

        return {
            accessToken: token,
            userId: credentials.userId
        };

    }
}


// await publish("UserCreated", {
//     key: credentials.userId,
//     data: {
//         eventId: randomUUID(),
//         eventType: "UserCreated",
//         ...credentials,
//         name: name
//     }
// });

// await this.userClient.createUser({
//     userId: credentials.userId,
//     name: name,
//     email: email
// });

export { AuthService };