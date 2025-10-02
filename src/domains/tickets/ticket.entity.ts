import { TicketType, TicketingError } from "./ticket.interfaces";

export class TicketEntity implements TicketType {
    id: string;
    name: string;
    price: number;
    capacity: number;
    remaining: number;

    constructor(ticket: TicketType) {
        this.id = ticket.id;
        this.name = ticket.name;
        this.price = ticket.price;
        this.capacity = ticket.capacity;
        this.remaining = ticket.remaining;
    }

    reserve(quantity: number) {
        if (quantity > this.remaining) {
            throw new TicketingError("Not enough tickets", "INSUFFICIENT_TICKETS", 400);
        }
        this.remaining -= quantity;
    }

    release(quantity: number) {
        if (this.remaining + quantity > this.capacity) {
            throw new TicketingError("Cannot exceed capacity", "OVER_CAPACITY", 400);
        }
        this.remaining += quantity;
    }
}
