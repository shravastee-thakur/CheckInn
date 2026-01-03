# CheckInn

## Hotel Booking System Backend (SRP Structure)
### Overview

This project is a backend implementation of a hotel booking system following the Single Responsibility Principle (SRP). The system includes modules for managing users, hotels, rooms, and bookings with clean, maintainable, and modular code.

### Purpose: The system is designed for learning how to structure a backend application using SRP.

No frontend: This project does not include a frontend; it focuses solely on backend architecture and logic.

### Features

- User Authentication: JWT-based login and registration for users.

- Hotel Management: Admin can view, add, update, and delete hotels.

- Room Management: Includes creation of rooms with availability dates, checking for double bookings.

- Booking Management: Allows users to book rooms with date validation to avoid overlaps.

- Image Uploads: Using Cloudinary for hotel photo management.

- Rate Limiting: Prevents abuse of APIs via Redis rate-limiting for email and IP.

- Logging: Detailed API logging with Winston for debugging and monitoring.

- Validation: Request validation via Joi to ensure data integrity.

- Password Hashing: User passwords are hashed using Bcrypt.js.

- MongoDB Sanitation: All queries are sanitized to prevent MongoDB injection attacks.

### Technologies Used

- Node.js: JavaScript runtime to build the backend.

- Express.js: Framework for building REST APIs.

- MongoDB: NoSQL database for data storage.

- Mongoose: ODM to interact with MongoDB.

- JWT: Authentication and authorization mechanism.

- Cloudinary: Used for storing images (e.g., hotel photos).

- Bcrypt: For password hashing.

- Joi: Request validation for APIs.

- Multer: For handling file uploads.

- Redis: For OTP storage and rate limiting (with IP and email).

- Winston: For logging.

- Mongo Sanitize: For query sanitization.

### Modules

User Module

- User registration and login (JWT-based authentication).

- Role-based access control (Admin, User).

Hotel Module

- Admin can add, update, delete, and view hotels.

- Handles hotel details like name, location, photos, and amenities.

Room Module

- Admin can manage rooms, check availability, and handle room creation.

- Prevents double bookings by ensuring availability dates don't overlap.

Booking Module

- Users can book rooms by selecting a hotel, room, and booking dates.

- Handles booking status (pending, confirmed, canceled).

## License

This project is licensed under the MIT License - see the LICENSE
 file for details.
