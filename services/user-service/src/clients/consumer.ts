import { kafkaClient } from "../config/kafka.js";
import { UserService } from "../services/user.service.js";

const consumer = kafkaClient.consumer({
    groupId: "user-group"
});

const userService = new UserService();

async function startConsuming() {
    await consumer.connect();

    await consumer.subscribe({
        topic: "UserCreated",
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ message }) => {

            console.log(message);

            const event = JSON.parse(message.value!.toString());

            await userService.createUser(event.userId, event.name, event.email);
        }
    });
}

export { startConsuming };