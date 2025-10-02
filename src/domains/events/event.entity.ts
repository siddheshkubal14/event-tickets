import { TicketType, TicketingError } from "../tickets/ticket.interfaces";
import { redisRepo } from "../../db/redisRepo";

export class EventEntity {
    id: string;
    name: string;
    date: Date;
    venue: string;
    ticketTypes: TicketType[];

    constructor(event: { id: string; name: string; date: Date; venue: string; ticketTypes: TicketType[] }) {
        this.id = event.id;
        this.name = event.name;
        this.date = event.date;
        this.venue = event.venue;
        this.ticketTypes = event.ticketTypes;
    }

    async initTickets() {
        // Initializing Redis inventory for tickets
        for (const ticket of this.ticketTypes) {
            const existing = await redisRepo.getTicket(ticket.id);
            if (!existing) {
                await redisRepo.saveTicket(ticket);
                // Storing remaining tickets separately for atomic operations
                await redisRepo.setTicketRemaining(ticket.id, ticket.remaining);
            }
        }
    }

    findTicketType(ticketTypeId: string): TicketType {
        const ticket = this.ticketTypes.find(tt => tt.id === ticketTypeId);
        if (!ticket) throw new TicketingError("Ticket type not found", "TICKET_NOT_FOUND", 404);
        return ticket;
    }
}
