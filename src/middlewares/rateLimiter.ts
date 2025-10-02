import rateLimit from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants";
import config from "../config";

/**
 * Rate limiting middleware for Express applications.
 * This middleware limits the number of requests from a single IP address
 * to prevent abuse and ensure fair usage of resources.
 * 
 * Configuration:
 * - windowMs: 15 minutes
 * - max: 500 requests per window
 * - standardHeaders: true (includes rate limit info in response headers)
 * - legacyHeaders: false (disables the X-RateLimit-* headers)
 * - message: Custom error message for too many requests
 */
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs, // 15 minutes
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
});

export default limiter;
