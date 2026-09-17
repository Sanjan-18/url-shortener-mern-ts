# URL Shortener — MERN + TypeScript

A full-stack URL shortener inspired by the supplied reference screenshot.

## Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React icons

### Backend
- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- nanoid
- CORS
- dotenv

## Features
- Paste a long URL and generate a short code.
- Save shortened URLs in MongoDB.
- Display Full URL, Short URL and Clicks in a table.
- Copy a shortened URL.
- Delete a URL.
- Redirect from `/api/r/:code` and increment clicks.
- Responsive dark UI matching the supplied design.

## Run

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

For macOS/Linux:
```bash
cp .env.example .env
npm install
npm run dev
```

Set your MongoDB connection string in `.env`.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Environment

Backend `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/urlshortener
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## API

- `GET /api/urls` — list URLs
- `POST /api/urls` — create `{ "originalUrl": "https://example.com" }`
- `DELETE /api/urls/:id` — delete URL
- `GET /api/r/:code` — redirect and increment clicks
- `GET /api/health` — health check
