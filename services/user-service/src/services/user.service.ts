import { pool } from "../config/pool.js";
import { ProcessedEventsRepository } from "../repository/processedEvents.repository.js";
import { UserRepository } from "../repository/user.repository.js";

class UserService {

    userRepository: UserRepository
    processedEventRepository: ProcessedEventsRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.processedEventRepository = new ProcessedEventsRepository();
    }

    async createUser(userId: string, name: string, email: string) {
        return this.userRepository.create(userId, name, email);
    }

    async getUser(id: string) {
        return this.userRepository.findById(id);
    }

    async handleUserCreated(event: any) {

        try {

            await pool.query("BEGIN");


            const processed =
                await this.processedEventRepository.findByEventId(
                    event.eventId
                );


            if (processed) {
                await pool.query("ROLLBACK");
                return;
            }


            await this.userRepository.create(
                event.userId,
                event.name,
                event.email
            );


            await this.processedEventRepository.create(
                event.eventId,
                event.eventType
            );


            await pool.query("COMMIT");


        } catch (error) {

            await pool.query("ROLLBACK");
            throw error;

        }
    }

}

export { UserService };