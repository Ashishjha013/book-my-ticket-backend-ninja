# Book My Ticket

This is a backend project for the Backend Ninja hackathon track.

The main goal is simple:

- users can register
- users can login
- only logged-in users can book seats
- same seat cannot be booked two times

## What This Project Does

- Creates user accounts
- Logs users in and gives a JWT token
- Protects booking API with auth middleware
- Lets users see seats and book a seat
- Saves which user booked which seat

## Tech Used

- Node.js
- Express.js
- PostgreSQL
- bcrypt
- JWT (jsonwebtoken)

## Folder Structure

```text
book-my-show/
  src/
    app.js
    server.js
    auth/
    booking/
    db/
    assets/
```

## Database Design

![Book My Ticket DB Design](src/assets/book-my-show-db.png)

Tables used:

- users
- seats
- bookings

Relations:

- bookings.user_id -> users.id
- bookings.seat_id -> seats.id

## How Duplicate Booking Is Prevented

- Seat row is locked in transaction (`SELECT ... FOR UPDATE`)
- A unique index is also used on bookings seat_id

This means even if two requests come at the same time, only one can win.

## Setup (Very Easy)

1. Go to source folder

```bash
cd src
```

2. Install packages

```bash
npm install
```

3. Create `.env` file inside `src`

Use this template:

```env
PORT=8080
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development

PGUSER=postgres
PGHOST=localhost
PGDATABASE=booking
PGPASSWORD=postgres
PGPORT=5432
```

4. Run migration

```bash
npm run migrate
```

5. Start server

```bash
npm run dev
```

Server URL:
http://localhost:8080

## API List

- GET /health
- POST /auth/register
- POST /auth/login
- GET /booking/seats
- POST /booking/book/:seatId (protected)

## Quick Test with cURL

Register:

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

Login:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

Book seat (use token from login response):

```bash
curl -X POST http://localhost:8080/booking/book/10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Hackathon Checklist Coverage

- Authentication implementation: Done
- Protected routes: Done
- Booking logic correctness: Done
- Clean code structure: Done
- Integration with existing code: Done
- Frontend: Optional (not included)
