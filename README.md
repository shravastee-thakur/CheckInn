
<img width="1261" height="597" alt="CheckInn1" src="https://github.com/user-attachments/assets/44b156b9-7f35-4a04-877b-6167d93288ad" />
<img width="1263" height="595" alt="CheckInn2" src="https://github.com/user-attachments/assets/ec6a0b81-5afe-47f2-89db-408d2a4c813f" />

<img width="1259" height="591" alt="CheckInn3" src="https://github.com/user-attachments/assets/1ef79031-f17c-4d37-875c-7e9b65e225de" />

# CheckInn (Version 2.0)

## A Learning Journey in Hotel Booking Logic & Backend Architecture
### Overview

CheckInn is a hotel booking project built to explore the complexities of the MERN stack. I used this version to push myself out of my comfort zone by moving away from simple CRUD operations and experimenting with concepts like Single Responsibility Principle, distributed locking, concurrency, and background task processing.

## Key Learning Objectives & Features

In Version 2.0, I transitioned from a basic "per-room" model to a more scalable Inventory-Based Approach (managing quantities like "5 Deluxe Rooms"). This change allowed me to explore several backend challenges:

- **Concurrency Management (Redis NX):** To learn how to prevent overbooking, I implemented a simple distributed lock using ioredis. This ensures that during high-traffic moments, the system processes inventory checks sequentially rather than all at once.

- **Data Integrity (MongoDB Transactions):** I practiced using ACID transactions to ensure that "Booking Creation" and "Inventory Updates" stay in sync. If the booking fails, the inventory update rolls back automatically.

- **Asynchronous Tasks (BullMQ):** I wanted to understand how to keep an API responsive. I offloaded time-consuming tasks like OTP generation and email notifications to background workers using BullMQ and Redis.

- **Automated Cleanup (TTL Indexes):** To handle abandoned bookings, I used MongoDB Partial TTL Indexes. This "Reaper" logic automatically expires pending bookings after 15 minutes to release the rooms back into the inventory.

- **Security & Bot Protection:** Beyond standard JWT, I integrated ArcJet to experiment with Shield and Bot protection, helping me understand how to defend against automated scrapers.

### Tech Stack
**Backend Infrastructure**
- Runtime: Node.js & Express.js
- Architecture: Single Responsibility Principle (SRP) / Repository-Service-Controller Pattern
- Database: MongoDB (with ACID Transactions & TTL Indexes)
- In-Memory Store: Redis (via Upstash)
- Message Broker: BullMQ (IORedis-backed)

**Security & Payments**
- Payments: Stripe API (with Webhook integration)
- Auth: JWT (Access/Refresh Token Rotation), 2FA with Redis-stored OTPs, bcrypt hashing.
- Validation: Joi (Schema-based validation)
- Protection: Rate Limiting (Redis), ArcJet (BOT and Shield), Helmet.js, Mongo-sanitize.

**Media & Services**
- Image Storage: Cloudinary (via Multer)
- Logging: Winston (Structured logs for debugging)
- Email: Brevo/Nodemailer

### Architecture & Pattern Exploration
**Single Responsibility Principle (SRP)** The most significant part of my learning was refactoring the code so that each module has one clear purpose. This makes the project much easier to debug and test:

- Controllers: Handle request parsing and responses.

- Services: Where the "heavy lifting" and business logic live.

- Repositories: Dedicated solely to data access and Mongoose queries.

- Workers: Handle the background jobs.

**Concurrency Flow**
Request: 
1. Request: User attempts a booking.
2. Lock: A Redis SET NX lock is placed on the room type.
3. Validate: The Service checks if rooms are actually available.
4. Execute: A Mongoose Transaction creates the booking and updates inventory.
5. Unlock: The Redis key is cleared for the next request.

### Why I built this
As a self-taught developer, I wanted to understand the "Why" behind system design choices. Building CheckInn helped me bridge the gap between "making it work" and "making it reliable." It isn't a perfect system, but it represents a significant step in my understanding of how distributed components interact in a modern backend.
