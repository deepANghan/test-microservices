import { ProcessedEventsRepository } from "../repository/processedEvents.repository.js";

class ProcessedEventsService {

    processedEventsRepository: ProcessedEventsRepository;

    constructor() {
        this.processedEventsRepository = new ProcessedEventsRepository();
    }

    async markProcessed(
        eventId: string,
        eventType: string
    ) {
        return this.processedEventsRepository.create(
            eventId,
            eventType
        );
    }


    async isProcessed(
        eventId: string
    ) {
        return this.processedEventsRepository.findByEventId(eventId);
    }

}

export { ProcessedEventsService };