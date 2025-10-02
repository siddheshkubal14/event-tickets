import { redisClient } from "./redisClient";
import { Checkout } from "../domains/checkout/checkout.interfaces";
import { TicketType } from "../domains/tickets/ticket.interfaces";

export class RedisRepo {
    // Tickets
    async getTicket(ticketTypeId: string): Promise<TicketType | null> {
        const data = await redisClient.get(`ticket:${ticketTypeId}`);
        if (!data) return null;
        return JSON.parse(data);
    }

    async saveTicket(ticket: TicketType) {
        await redisClient.set(
            `ticket:${ticket.id}`,
            JSON.stringify(ticket)
        );
    }

    async reserveTicket(ticketTypeId: string, quantity: number) {
        const result = await redisClient.decrby(`ticket:${ticketTypeId}:remaining`, quantity);
        if (result < 0) {
            // revert
            await redisClient.incrby(`ticket:${ticketTypeId}:remaining`, quantity);
            throw new Error("Not enough tickets available");
        }
        return result;
    }

    async releaseTicket(ticketTypeId: string, quantity: number) {
        await redisClient.incrby(`ticket:${ticketTypeId}:remaining`, quantity);
    }

    // Checkout
    async saveCheckout(checkout: Checkout, ttlSeconds: number) {
        await redisClient.set(
            `checkout:${checkout.id}`,
            JSON.stringify(checkout),
            "EX",
            ttlSeconds
        );
    }

    async getCheckout(checkoutId: string): Promise<Checkout | null> {
        const data = await redisClient.get(`checkout:${checkoutId}`);
        if (!data) return null;
        return JSON.parse(data);
    }

    async deleteCheckout(checkoutId: string) {
        await redisClient.del(`checkout:${checkoutId}`);
    }

    async setTicketRemaining(ticketTypeId: string, remaining: number) {
        await redisClient.set(`ticket:${ticketTypeId}:remaining`, remaining);
    }
}

export const redisRepo = new RedisRepo();
