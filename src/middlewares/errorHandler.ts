import { Request, Response, NextFunction } from "express";
import { log } from "../utils/logger";
import { ERROR_MESSAGES } from "../constants";

/**
 * Error handler middleware for Express applications.
 * This middleware catches errors thrown in the application and sends a standardized error response.
 * It logs the error details for debugging purposes.
 *
 * @param err - The error object caught by the middleware.
 * @param req - The request object.
 * @param res - The response object.
 * @param _next - The next function (not used here).
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    log("error", "Error caught by error handler:", "", err);
    res.status(err.status || 500).json({
        message: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        details: err.details || null
    });
};

export default errorHandler;