import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { generateToken } from "../utils/jwt.js";
import { CredentialsRepository } from "../repository/credentials.repository.js";
import { UserClient } from "../clients/user.client.js";
import { publish } from "../clients/producer.js";



class AuthService {


    private credentialsRepository: CredentialsRepository;
    private userClient: UserClient;

    constructor() {
        this.credentialsRepository = new CredentialsRepository();
        this.userClient = new UserClient();
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

        const credentials =
            await this.credentialsRepository.create({
                userId: randomUUID(),
                email,
                passwordHash,
                createdAt: new Date()
            });


        // call user service to save user data

        try {

            // await this.userClient.createUser({
            //     userId: credentials.userId,
            //     name: name,
            //     email: email
            // });

            await publish("UserCreated", {
                key: credentials.userId,
                data: {
                    eventId: randomUUID(),
                    eventType: "UserCreated",
                    ...credentials,
                    name: name
                }
            });

        } catch (error) {

            // revert the credentials entry
            await this.credentialsRepository.deleteById(credentials.userId);

            console.log((error as unknown as Error).message);
            throw new Error("User Service Failed");
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

export { AuthService };