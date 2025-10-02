import dotenv from "dotenv";
dotenv.config();

const config = {
    port: parseInt(process.env.PORT ?? "4000", 10),
    apiKey: process.env.API_KEY ?? "",
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()) || [],
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "900000", 10), // 15 min default
        max: parseInt(process.env.RATE_LIMIT_MAX ?? "100", 10)
    },
    reservationTTL: parseInt(process.env.RESERVATION_TTL ?? "300", 10), // 5 min default
    redisHost: process.env.REDIS_HOST || "127.0.0.1",
    redisPort: Number(process.env.REDIS_PORT) || 6379,
};

export default config;
