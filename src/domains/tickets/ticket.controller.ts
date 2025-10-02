import { Request, Response, NextFunction } from "express";
import { ticketService } from "./ticket.service";
import { TicketingError } from "./ticket.interfaces";

export class TicketController {
    async reserveTicket(req: Request, res: Response, next: NextFunction) {
        try {
            const { ticketTypeId, quantity } = req.body;
            if (!ticketTypeId || !quantity) {
                return res.status(400).json({ message: "ticketTypeId and quantity are required" });
            }

            await ticketService.reserveTicket(ticketTypeId, quantity);
            return res.status(200).json({ message: "Ticket reserved successfully" });
        } catch (err) {
            if (err instanceof TicketingError) {
                return res.status(err.status).json({ code: err.code, message: err.message });
            }
            next(err);
        }
    }

    async releaseTicket(req: Request, res: Response, next: NextFunction) {
        try {
            const { ticketTypeId, quantity } = req.body;
            if (!ticketTypeId || !quantity) {
                return res.status(400).json({ message: "ticketTypeId and quantity are required" });
            }

            await ticketService.releaseTicket(ticketTypeId, quantity);
            return res.status(200).json({ message: "Ticket released successfully" });
        } catch (err) {
            if (err instanceof TicketingError) {
                return res.status(err.status).json({ code: err.code, message: err.message });
            }
            next(err);
        }
    }
}

export const ticketController = new TicketController();
