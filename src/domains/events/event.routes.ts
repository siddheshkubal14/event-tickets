import { Router } from "express";
import { eventController } from "./event.controller";
import { validate } from "../../middlewares/validate";
import { EventSchema } from "./event.schema";

const eventsRouter = Router();

eventsRouter.post("/", validate(EventSchema), eventController.createEvent.bind(eventController));
eventsRouter.get("/", eventController.listEvents.bind(eventController));
eventsRouter.get("/:id", eventController.getEvent.bind(eventController));

export default eventsRouter;
