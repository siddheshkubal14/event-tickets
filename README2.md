# Event Ticketing System

A simplified, scalable ticketing system that allows fans to purchase concert tickets smoothly at release time, while handling high traffic and preventing bots. Built in TypeScript with clean architecture and Redis for persistent and concurrency-safe inventory management.

---

## Features

* **Event Management:**

  * Store event details (name, date, venue).
  * Support multiple ticket types (VIP, General Admission).
  * Seat-level ticket allocation (each ticket tied to a specific seat).

* **Ticket Inventory:**

  * Track available tickets per ticket type.
  * Concurrency-safe purchase using Redis atomic operations.
  * Reservation mechanism to temporarily hold tickets during checkout.

* **Checkout Flow:**

  * Secure checkout endpoint.
  * Validates user input and ticket availability.
  * Rate-limiting to mitigate bot traffic.

* **Bot & Load Handling:**

  * API rate-limiting per IP or user.
  * CORS and authentication middleware.
  * Optimized for burst traffic scenarios common in ticket sales.

---

## File and Folder Structure

```bash
.
├── src/
│   ├── app.ts / server.ts              # Entry points
│   ├── config.ts / constants.ts        # Configuration & constants
│   ├── db/
│   │   ├── redisClient.ts              # Redis connection
│   │   └── redisRepo.ts                # Redis operations (atomic, concurrency-safe)
│   ├── domains/
│   │   ├── checkout/
│   │   │   ├── checkout.controller.ts
│   │   │   ├── checkout.service.ts
│   │   │   ├── checkout.schema.ts
│   │   │   └── checkout.interfaces.ts
│   │   ├── events/
│   │   │   ├── event.controller.ts
│   │   │   ├── event.entity.ts
│   │   │   ├── event.interfaces.ts
│   │   │   └── event.service.ts
│   │   └── tickets/
│   │       ├── ticket.controller.ts
│   │       ├── ticket.entity.ts
│   │       ├── ticket.interfaces.ts
│   │       └── ticket.service.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── corsOptions.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   └── utils/
│       └── logger.ts
├── .env
├── package.json / package-lock.json
└── tsconfig.json
```

---

## Architecture Overview

* **Controller Layer:** Handles HTTP requests, input validation, and error responses.
* **Service Layer:** Business logic for events, tickets, and checkout. Handles inventory and reservation flow.
* **Data Layer (Redis):**

  * Concurrency-safe ticket inventory management using atomic operations.
  * Supports temporary reservations with expiration for checkout sessions.
* **Middleware:**

  * Rate-limiting for burst traffic protection.
  * CORS, authentication, and global error handling.
* **Seat-level Allocation:** Each ticket is linked to a specific seat to prevent overselling.

---

## Concurrency & Burst Handling

* Redis atomic operations ensure that multiple concurrent checkout requests cannot oversell tickets.
* Reservations hold tickets for a short period (e.g., 5 minutes) until the purchase is confirmed.
* Rate limiting reduces bot traffic and mitigates server overload during ticket release.
* For extreme scale, multi-region Redis clusters and sharding could be implemented.

---

### Production-grade Improvements

If given more time, the following enhancements could make the system **scalable, resilient, and fair under extreme load**:

1. **Distributed Locking for Multi-instance Deployments**

   * Use Redis Redlock or Zookeeper-based distributed locks for atomic ticket allocation across multiple server instances.
   * Ensures no race conditions even in a horizontally scaled architecture.

2. **Optimistic Locking**

   * Use version numbers or timestamps in ticket entities.
   * On purchase, only decrement if the version hasn’t changed, preventing overselling in distributed DB setups.

3. **Queue-based Checkout Flow**

   * Implement a FIFO queue (e.g., using Redis Streams, Kafka, or RabbitMQ).
   * Ensures that ticket purchase requests are processed sequentially and fairly during release bursts.

4. **Shard Ticket Inventory**

   * Split tickets by type or seat sections across multiple Redis keys or clusters.
   * Reduces contention and improves throughput for high-demand events.

5. **Rate Limiting with Bot Detection**

   * Advanced rate-limiting with behavioral analysis (e.g., CAPTCHA on suspicious activity).
   * Combine with user verification (email/phone) to reduce bot purchases.

6. **Idempotent Checkout Requests**

   * Assign a unique checkout session ID to each attempt.
   * Prevents duplicate purchases if a request is retried due to network issues.

7. **Monitoring & Metrics**

   * Track failed purchase attempts, oversell attempts, and reservation expirations.
   * Enable auto-scaling during release peaks based on these metrics.

8. **Fallback Mechanisms**

   * If Redis is down, temporarily switch to in-memory or DB-backed queue with eventual consistency.
   * Avoids full system outage during ticket release spikes.


---

## Future Improvements

| Area                     | Enhancement                                                    |
| ------------------------ | -------------------------------------------------------------- |
| Payment Integration      | Add real payment gateways (Stripe, Razorpay, etc.)             |
| Unit & Integration Tests | Full tests for event creation, checkout, concurrency scenarios |
| Monitoring & Metrics     | Track inventory, failed checkouts, and bot attempts            |
| Scalability              | Redis clusters, horizontal scaling, queueing for peak traffic  |
| Bot Detection            | CAPTCHA, email verification, and behavior-based throttling     |
| Notifications            | Send purchase confirmation via email or SMS                    |

---

## Environment Variables

Set in `.env` file:

```bash
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
API_KEY=464064cf4820c736c1b57f8375ee753985c0bd15aa0c05f57fe9d913eae23b1d
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
```

---

## Running Locally

```bash
npm install
npm run build
npm start
```

* API runs at: `http://localhost:3000`
* Redis required for inventory and reservation management

---

## Design Decisions

* **Concurrency-safe inventory**: lightweight, fast, supports atomic ops.
* **Clean separation of concerns**: Controllers → Services → Entities → Data Layer.
* **TypeScript & Interfaces**: Full type safety across entities and services.
* **Rate-limiting & middleware**: Simple first line of defense against bots.
* **Seat-level tracking**: Prevents double-booking in high-demand events.
* **Future-Improvements-Suggested**: Suggested future improvements in system.

---



