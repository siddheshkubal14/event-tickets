import { Request, Response, NextFunction } from "express";
import { checkoutService } from "./checkout.service";
import { eventService } from "../events/event.service";
import { ERROR_MESSAGES } from "../../constants";

export class CheckoutController {
    async reserve(req: Request, res: Response, next: NextFunction) {
        try {
            const { eventId, ticketTypeId, quantity } = req.body;
            const event = await eventService.getEventById(eventId);
            if (!event) {
                throw new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
            }

            const checkout = await checkoutService.reserve(eventId, ticketTypeId, quantity);
            res.status(201).json(checkout);
        } catch (err) {
            next(err);
        }
    }

    async confirm(req: Request, res: Response, next: NextFunction) {
        try {
            const { checkoutId } = req.body;
            const checkout = await checkoutService.confirm(checkoutId);
            res.json(checkout);
        } catch (err) {
            next(err);
        }
    }

    async cancel(req: Request, res: Response, next: NextFunction) {
        try {
            const { checkoutId } = req.body;
            const checkout = await checkoutService.cancel(checkoutId);
            res.json(checkout);
        } catch (err) {
            next(err);
        }
    }
}

export const checkoutController = new CheckoutController();
