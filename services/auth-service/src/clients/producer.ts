import { kafkaClient } from "../config/kafka.js";

const producer = kafkaClient.producer();

async function startProducer() {
    await producer.connect();
}

async function publish(topic: string, data: any) {

    await producer.send({
        topic,
        messages: [
            {
                key: data.key,
                value: JSON.stringify(data.data)
            }
        ]
    });

}

export { startProducer, publish };