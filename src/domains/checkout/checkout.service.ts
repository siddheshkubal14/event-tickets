import { v4 as uuidv4 } from "uuid";
import { CheckoutEntity } from "./checkout.entity";
import { CheckoutStatus } from "./checkout.interfaces";
import { redisRepo } from "../../db/redisRepo";
import { ticketService } from "../tickets/ticket.service";
import config from "../../config";
import { ERROR_MESSAGES } from "../../constants";

export class CheckoutService {
    private RESERVATION_TTL = config.reservationTTL;

    async reserve(eventId: string, ticketTypeId: string, quantity: number) {
        await ticketService.reserveTicket(ticketTypeId, quantity);

        const checkout = new CheckoutEntity({
            id: uuidv4(),
            eventId,
            ticketTypeId,
            quantity,
            status: CheckoutStatus.PENDING,
            expiresAt: new Date(Date.now() + this.RESERVATION_TTL * 1000)
        });

        await redisRepo.saveCheckout(checkout, this.RESERVATION_TTL);
        return checkout;
    }

    async confirm(checkoutId: string) {
        const checkout = await redisRepo.getCheckout(checkoutId);
        if (!checkout) throw new Error(ERROR_MESSAGES.CHECKOUT_NOT_FOUND);
        if (checkout.status !== CheckoutStatus.PENDING) throw new Error("Cannot confirm checkout");

        const entity = new CheckoutEntity(checkout);
        entity.markCompleted();

        await redisRepo.deleteCheckout(checkoutId);
        return entity;
    }

    async cancel(checkoutId: string) {
        const checkout = await redisRepo.getCheckout(checkoutId);
        if (!checkout) throw new Error(ERROR_MESSAGES.CHECKOUT_NOT_FOUND);

        const entity = new CheckoutEntity(checkout);
        entity.markExpired();
        await ticketService.releaseTicket(entity.ticketTypeId, entity.quantity);
        await redisRepo.deleteCheckout(checkoutId);

        return entity;
    }
}

export const checkoutService = new CheckoutService();
