import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
    clientId: "user-service",
    brokers: ["localhost:9092"]
});

export { kafkaClient };