# Backend README

## Overview
This directory contains the backend API for the photo-sharing application. It is built with Express.js and TypeScript, using Prisma as the database layer and PostgreSQL as the main data store.

The API supports:
- user authentication and authorization
- email verification and password reset
- photo and album management
- likes, follows, and profile interactions
- image upload integration with Cloudinary
- admin-level management endpoints

## Architecture
The backend follows a layered structure that separates routing, controllers, services, schema validation, and database access.

### Main layers
- Routes: define API endpoints and connect them to controllers
- Controllers: handle HTTP requests and responses
- Services: contain business logic
- Middlewares: handle auth, validation, upload, and error handling
- Prisma: manages database access and models
- Config: contains DB, Cloudinary, and Passport setup

## Technology Stack
### Core runtime
- Node.js
- Express.js
- TypeScript

### Database and ORM
- Prisma ORM
- PostgreSQL
- Prisma Pg adapter

### Authentication and security
- JWT
- Passport.js
- bcryptjs
- cookie-parser
- CORS

### File handling and media
- multer
- Cloudinary
- file-type

### Validation and email
- Zod
- express-validator
- nodemailer
- resend

## Project Structure
```text
backend/
  src/
    config/         # Prisma, Cloudinary, Passport, DB config
    controllers/    # Request handlers for each resource
    middlewares/    # Auth, validation, upload, error middleware
    prisma/         # Prisma schema and migrations
    routes/         # API route definitions
    schemas/        # Validation schemas
    services/       # Business logic
    utils/          # Shared helper utilities
    index.ts        # App entry point
```

## Main Features
### Authentication
- register / login / logout
- refresh token flow
- forgot password / reset password
- email verification and resend verification
- Google and Facebook OAuth support

### User management
- view user profiles
- update user profile and avatar
- change password
- follow / unfollow users
- view followers and followings
- admin user management

### Photo management
- create, update, delete photos
- browse public and feed-based photo lists
- view photo details
- like/unlike photos

### Album management
- create, update, delete albums
- browse albums by discover/feed/public views
- attach multiple images to albums
- like/unlike albums

## Environment Variables
The backend expects the following environment variables:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

EMAIL_FROM=your_email
RESEND_API_KEY=your_resend_key
```

## Available Scripts
From the backend folder:

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## Database
The project uses Prisma with a PostgreSQL database. The schema is defined in:
- [src/prisma/schema.prisma](backend/src/prisma/schema.prisma)

Common Prisma workflows:
```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio
```

## Summary
The backend is a full-featured REST API for a social photo application, combining modern Node.js practices with Prisma-based persistence, secure authentication, media uploads, and role-based access control.
