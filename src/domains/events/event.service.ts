import { v4 as uuidv4 } from "uuid";
import { EventEntity } from "./event.entity";
import { TicketType, TicketTypeId } from "../tickets/ticket.interfaces";
import { ERROR_MESSAGES } from "../../constants";

interface CreateEventDTO {
    name: string;
    date: Date;
    venue: string;
    ticketTypes: { type: TicketTypeId; price: number; quantity: number }[];
}

export class EventService {
    private events: Map<string, EventEntity> = new Map();

    async createEvent(eventData: CreateEventDTO) {
        const id = uuidv4();

        const tickets: TicketType[] = eventData.ticketTypes.map(tt => ({
            id: tt.type,
            name: tt.type,
            price: tt.price,
            capacity: tt.quantity,
            remaining: tt.quantity
        }));

        const event = new EventEntity({ id, ...eventData, ticketTypes: tickets });
        await event.initTickets();  // saves tickets in Redis
        this.events.set(id, event);
        return event;
    }

    async getEventById(id: string) {
        const event = this.events.get(id);
        if (!event) throw new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
        return event;
    }

    async listEvents() {
        return Array.from(this.events.values());
    }
}

export const eventService = new EventService();
