import { kafkaClient } from "../config/kafka.js";
import { pool } from "../config/pool.js";
import { ProcessedEventsService } from "./processedEvents.service.js";
import { UserService } from "./user.service.js";

const consumer = kafkaClient.consumer({
    groupId: "user-group"
});

const userService = new UserService();

async function startConsuming() {
    await consumer.connect();

    await consumer.subscribe({
        topic: "user-events",
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            const event = JSON.parse(message.value!.toString());

            console.log(event);

            try {

                if (event.eventType === "UserCreated") {
                    await userService.handleUserCreated(event);
                }

                await consumer.commitOffsets([
                    {
                        topic,
                        partition,
                        offset: (Number(message.offset) + 1).toString()
                    }
                ]);

            } catch (error) {
                console.error("Event processing failed", error);
                return;
            }

        }
    });
}

export { startConsuming };