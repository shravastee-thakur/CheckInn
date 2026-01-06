
<img width="1261" height="597" alt="CheckInn1" src="https://github.com/user-attachments/assets/44b156b9-7f35-4a04-877b-6167d93288ad" />
<img width="1263" height="595" alt="CheckInn2" src="https://github.com/user-attachments/assets/ec6a0b81-5afe-47f2-89db-408d2a4c813f" />

<img width="1259" height="591" alt="CheckInn3" src="https://github.com/user-attachments/assets/1ef79031-f17c-4d37-875c-7e9b65e225de" />

# CheckInn

## Hotel Booking System (SRP Structure)
### Overview

A MERN based Hotel Booking website following the Single Responsibility Principle (SRP), that provides functionality for hotel management, room booking, and payment processing. This project includes features like date concurrency, two-factor authentication (2FA), rate limiting with Redis, role-based access control (RBAC), and payment integration using Stripe.

### Features
- **Hotel Management**: Admins can add, update, or delete hotels and manage the list of rooms.
- **Room Booking**: Users can browse hotels, check room availability, and book rooms based on their preferences.
- **Date Concurrency**: Prevents double booking of rooms for the same dates.
- **Payment Gateway Integration**: Stripe is used to process payments for bookings.
- **Two-Factor Authentication (2FA)**: Users can enable 2FA for added security during login.
- **Role-Based Access Control (RBAC)**: Different user roles (Admin, User) with restricted access to certain features.
- **Rate Limiting**: Redis is used to limit the number of requests from users and to store OTPs.
- **Secure Authentication**: JWT-based authentication and bcrypt for password hashing.

### Technologies Used
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcrypt
- File Uploads: Multer, Cloudinary (for images)
- Redis: Used for rate limiting and OTP storage
- Payment Gateway: Stripe
- Logging: Winston
- Email Service: Nodemailer
- Validation: Joi
- Security: Helmet, mongo-sanitize
- Other: dotenv, cookie-parser, cors

### Prerequisites
- Node.js (>= 16.0.0)
- MongoDB (cloud or local instance)
- Redis (for rate limiting and OTP storage)
- Stripe account (for payment processing)
- Cloudinary account (for image uploads)
