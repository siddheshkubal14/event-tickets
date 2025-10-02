import { ERROR_MESSAGES } from "../../constants";
import { redisRepo } from "../../db/redisRepo";
import { TicketEntity } from "./ticket.entity";

export class TicketService {
    async reserveTicket(ticketTypeId: string, quantity: number) {
        const ticket = await redisRepo.getTicket(ticketTypeId);
        if (!ticket) throw new Error(ERROR_MESSAGES.TicketType_NOT_FOUND);

        const entity = new TicketEntity(ticket);
        // atomic decrement in Redis
        await redisRepo.reserveTicket(ticketTypeId, quantity);

        entity.reserve(quantity);
        await redisRepo.saveTicket(entity);
    }

    async releaseTicket(ticketTypeId: string, quantity: number) {
        const ticket = await redisRepo.getTicket(ticketTypeId);
        if (!ticket) throw new Error(ERROR_MESSAGES.TicketType_NOT_FOUND);

        const entity = new TicketEntity(ticket);
        entity.release(quantity);
        await redisRepo.saveTicket(entity);
        await redisRepo.releaseTicket(ticketTypeId, quantity);
    }
}

export const ticketService = new TicketService();
