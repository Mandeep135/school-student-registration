
# School Student Registration System

Weekly Checkpoint 4 – Advanced Application Development

## Technologies
- React + TypeScript
- Vite 7
- Node.js + Express
- JWT Authentication
- bcryptjs
- PWA Service Worker

## Features
- Student registration
- Form validation
- Student login
- Secure password hashing
- JWT token generation
- Protected API endpoint
- Student welcome dashboard
- Service worker registration

## How to Run

Install dependencies:

npm install

Start the frontend:

npm run dev

Start the backend in a separate terminal:

node server/server.js

Create a `.env` file containing a secure JWT_SECRET before
starting the backend.

## API Endpoints

POST /api/register
POST /api/login
GET /api/profile

Backend: http://localhost:3001
Frontend: http://localhost:5173

## Note
Student records are stored in server memory and are cleared
when the backend restarts.
