import express, { Application, Router } from "express";
import cors from "cors";
import helmet from "helmet";
import { log } from "./utils/logger";

import authMiddleware from "./middlewares/auth";
import errorHandler from "./middlewares/errorHandler";
import corsOptions from "./middlewares/corsOptions";
import limiter from "./middlewares/rateLimiter";

import eventsRouter from "./domains/events/event.routes";
import checkoutRouter from "./domains/checkout/checkout.routes";

export default async (): Promise<Application> => {
    const app = express();

    // Middleware
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(limiter);

    // Router setup
    const router = Router();

    // Health-check
    router.get("/healthcheck", (req, res) => {
        res.status(200).json({ message: "healthy" });
    });

    // Authentication middleware 
    router.use(authMiddleware);

    // routes
    router.use("/events", eventsRouter);
    router.use("/checkout", checkoutRouter);


    // Attaching router and error handler
    app.use("/", router);
    app.use(errorHandler);

    return app;
};

// Global exception handling
process.on("uncaughtException", (error: Error) => {
    log("error", "Uncaught Exception", "", error);
});

process.on("unhandledRejection", (reason: unknown) => {
    log("error", "Unhandled Rejection", "", reason);
});
