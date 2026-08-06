import { kafkaClient } from "../config/kafka.js";
import { OutboxRepository } from "../repository/outboxEvents.repository.js"

const producer = kafkaClient.producer();

async function startProducer() {
    await producer.connect();
}

async function doPublish() {

    startProducer();

    let outboxRepo = new OutboxRepository();

    while (true) {

        const events = await outboxRepo.findPending();

        console.log("fetched events : ", events.length);

        for (const event of events) {

            try {

                await producer.send({
                    topic: event.event_domain,
                    messages: [
                        {
                            key: event.aggregate_id,
                            value: JSON.stringify(event.payload)
                        }
                    ]
                });

                await outboxRepo.markPublished(event.outbox_id);

            } catch (error) {

                console.error(
                    "Failed to publish event",
                    event.outbox_id,
                    error
                );

            }

        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

export { doPublish };