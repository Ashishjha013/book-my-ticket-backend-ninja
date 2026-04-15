# Book My Ticket (Backend Ninja Track)

Production-style backend extension of the starter code for a simplified Book My Ticket platform.

This submission focuses on authentication and protected seat booking flow (backend-first evaluation).

## Features

- User registration with password hashing
- User login with JWT token generation
- Protected booking endpoint using auth middleware
- Seat booking linked to logged-in user
- Duplicate seat booking prevention
- DB bootstrap/migration script for quick setup

## Tech Stack

- Node.js
- Express
- PostgreSQL
- bcrypt
- jsonwebtoken (JWT)

## Project Structure

```text
book-my-show/
   backend/
      app.js
      server.js
      auth/
         auth.controller.js
         auth.middleware.js
         auth.routes.js
         auth.service.js
      booking/
         booking.controller.js
         booking.routes.js
         booking.service.js
      db/
         db.js
         runMigrations.js
         schema.js
```

## Database Design

### users

- id (PK)
- name
- email (UNIQUE)
- password

### seats

- id (PK)
- seat_number (UNIQUE)
- is_booked

### bookings

- id (PK)
- user_id (FK -> users.id)
- seat_id (FK -> seats.id)
- created_at

Duplicate protection is implemented in two layers:

- Transaction + `SELECT ... FOR UPDATE` row lock
- Unique index on `bookings(seat_id)`

## Setup (Local)

1. Open project folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create/update `.env` (inside `backend`):

```env
PORT=8080
JWT_SECRET=replace-with-long-random-secret
NODE_ENV=development

# Local PostgreSQL config
PGUSER=postgres
PGHOST=localhost
PGDATABASE=booking
PGPASSWORD=postgres
PGPORT=5432
```

You can also use `DATABASE_URL` instead of PG\* variables.

4. Run migration/bootstrap:

```bash
npm run migrate
```

5. Start server:

```bash
npm run dev
```

Server runs at `http://localhost:8080` (or your configured `PORT`).

## API Endpoints

### Health

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Booking

- `GET /booking/seats`
- `POST /booking/book/:seatId` (protected)

## Quick API Test (cURL)

### 1) Register

```bash
curl -X POST http://localhost:8080/auth/register \
   -H "Content-Type: application/json" \
   -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

### 2) Login

```bash
curl -X POST http://localhost:8080/auth/login \
   -H "Content-Type: application/json" \
   -d "{\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

Copy `token` from the login response.

### 3) List seats

```bash
curl http://localhost:8080/booking/seats
```

### 4) Book seat (protected)

```bash
curl -X POST http://localhost:8080/booking/book/10 \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

If seat is already booked, API returns `409`.

## Hackathon Rubric Mapping

- Authentication Implementation: Register/login, bcrypt hashing, JWT issuance
- Protected Route Handling: Booking route guarded by token middleware
- Booking Logic Correctness: Row locking, transactional update/insert, duplicate prevention
- Code Structure and Readability: Layered modules (`auth`, `booking`, `db`)
- Integration with Existing Codebase: Existing flow retained and extended cleanly
- Optional Frontend Integration: Not included (backend-first submission)

## Notes

- Starter codebase was used as the base and extended.
- Frontend is intentionally omitted as optional per track guidance.
