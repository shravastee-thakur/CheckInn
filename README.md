
<img width="1261" height="597" alt="CheckInn1" src="https://github.com/user-attachments/assets/44b156b9-7f35-4a04-877b-6167d93288ad" />
<img width="1263" height="595" alt="CheckInn2" src="https://github.com/user-attachments/assets/ec6a0b81-5afe-47f2-89db-408d2a4c813f" />

<img width="1259" height="591" alt="CheckInn3" src="https://github.com/user-attachments/assets/1ef79031-f17c-4d37-875c-7e9b65e225de" />

# CheckInn (Version 2.0)

## Hotel Booking System (SRP Structure)
### Overview

CheckInn is a high-concurrency Hotel Booking System built using the MERN stack. Unlike standard clones, this project is engineered with a Single Responsibility Principle (SRP) architecture and focuses on distributed systems problems like race conditions, idempotency, and background task processing.

## Key Evolutionary Features (V2.0)
**While Version 1.0 established the SRP foundation, Version 2.0 introduces professional-grade infrastructure:**
- **Inventory-Based Booking**: Shifted from "per-room" booking to an "Inventory Approach." The system tracks room quantities (e.g., 5 Deluxe Rooms) and manages availability dynamically.

- **Distributed Locking (Redis NX)**: Prevents overbooking by using ioredis to implement a "Not Exists" (NX) locking mechanism. This ensures that only one request can process a specific room type at a time during high-traffic bursts.

- **Atomic Transactions (ACID)**: Uses MongoDB Sessions to ensure that "Booking Creation" and "Inventory Updates" happen as an atomic unit. If one fails, the entire process rolls back (Atomic Cleanup).

- **Background Workers (BullMQ)**: Decoupled heavy tasks like OTP delivery and email notifications using BullMQ. This ensures the main API thread remains responsive.

- **API Idempotency**: Implemented Idempotency-Key headers for payment and booking requests to prevent duplicate charges caused by network retries or user double-clicks.

- **The "Pending Room" Reaper**: A MongoDB Partial TTL Index that automatically expires pending bookings after 15 minutes, restoring inventory if the user fails to complete the payment.

### Tech Stack
**Backend Infrastructure**
- Runtime: Node.js & Express.js
- Architecture: Single Responsibility Principle (SRP) / Repository-Service-Controller Pattern
- Database: MongoDB (with ACID Transactions & TTL Indexes)
- In-Memory Store: Redis (via Upstash/Local IORedis)
- Message Broker: BullMQ (Redis-backed)

**Security & Payments**
- Payments: Stripe API (with Webhook integration)
- Auth: JWT (Access/Refresh Token Rotation), 2FA with Redis-stored OTPs, bcrypt hashing.
- Validation: Joi (Schema-based validation)
- Protection: Rate Limiting (Redis), Helmet.js, Mongo-sanitize.

**Media & Services**
- Image Storage: Cloudinary (via Multer)
- Logging: Winston (Structured logs for debugging)
- Email: Brevo/Nodemailer

### Architecture & Design Patterns
**Single Responsibility Principle (SRP)**

The codebase is strictly organized to ensure each module has one reason to change:

- Controllers: Handle HTTP parsing and response formatting.
- Services: Contain the "Business Logic" (e.g., checking availability, calculating prices).
- Repositories: Pure data access layer (Mongoose queries).
- Workers: Handle asynchronous background processing.

**Concurrency Flow**
Request: 
1. User attempts to book.
2. Lock: Redis SET NX locks the room type for 10 seconds.
3. Validate: Service checks inventory count vs. active bookings.
4. Execute: Mongoose Transaction creates a pending booking.
5. Unlock: Redis key is deleted; next user in queue is processed.
