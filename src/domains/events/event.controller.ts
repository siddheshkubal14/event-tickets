import { Request, Response, NextFunction } from "express";
import { eventService } from "./event.service";

export class EventController {
    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await eventService.createEvent(req.body);
            res.status(201).json(event);
        } catch (err) {
            next(err);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await eventService.getEventById(req.params.id);
            res.json(event);
        } catch (err) {
            next(err);
        }
    }

    async listEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const events = await eventService.listEvents();
            res.json(events);
        } catch (err) {
            next(err);
        }
    }
}

export const eventController = new EventController();
