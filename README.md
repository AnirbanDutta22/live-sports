# LiveScore AD

A full-stack real-time sports score and commentary platform built with **Node.js**, **TypeScript**, **PostgreSQL**, and **WebSockets**.  
It provides live match updates, commentary streaming, historical data access, and a responsive frontend dashboard for users to follow matches in real time.

---

## Project Overview

LiveScore DS is designed to simulate a production-ready live sports tracking system where users can:

- View ongoing and upcoming matches
- Receive live score updates instantly
- Read real-time commentary events
- Browse match history and past commentary
- Experience fast, event-driven communication through WebSockets

The project demonstrates both **backend architecture** and **frontend real-time integration**.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Drizzle ORM
- WebSockets (`ws`)
- Zod Validation

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Tanstack Query
- WebSocket Client

---

## Key Features

### Backend Features
- REST API for match and commentary management
- Real-time live score broadcasting
- Match-specific subscription model
- Historical commentary retrieval
- PostgreSQL database integration
- Schema validation with Zod
- Scalable modular folder structure
- Heartbeat system for dead socket cleanup

### Frontend Features
- Live match dashboard
- Real-time score updates without refresh
- Commentary feed updates instantly
- Clean and responsive UI
- Match detail pages
- Historical data browsing

---

## Real-Time System

The project uses **pure WebSockets** for ultra-fast communication.

Users subscribe to a specific match:

```json
{
  "action": "SUBSCRIBE",
  "matchId": 1
}
```

Whenever new commentary or score updates are created, subscribed users instantly receive:

```json
{
  "event": "NEW_COMMENTARY",
  "matchId": 1,
  "data": {
    "message": "Goal!",
    "minute": 45
  }
}
```

## Overall Project Structure

live-sports/
│
├── server/
│   ├── src/
│   │   ├── db/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── validations/
│   │   └── server.ts
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── main.tsx
│
└── README.md


## Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/livescore-ds.git
cd livescore-ds
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create .env
```bash
PORT=5000
DATABASE_URL=your_postgresql_url
```
Run migrations:
```bash
npm drizzle-kit push
```
Start backend:
```bash
npm dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm dev
```

## API Endpoints

### Matches
POST /api/matches
GET /api/matches
GET /api/matches/:id

### Commentary
POST /api/commentary
GET /api/commentary/match/:matchId

### Future Improvements
1. Authentication & Admin Panel
2. Redis Pub/Sub Scaling
3. Notifications
4. Multiple Sports Support
5. Deployment with Docker
6. Match Analytics Dashboard
7. AI-generated commentary summaries


## Author
**Anirban Dutta**

