interface OutboxEvent {
    outboxId: string;
    eventDomain: string;
    aggregateId: string;
    payload: object;
    status: string;
    createdAt: Date;
}

export type { OutboxEvent };