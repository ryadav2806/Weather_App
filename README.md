
# Weather Dashboard (React Vite + Node/Express + MySQL)

## Overview
- React (Vite) frontend in `client/`
- Node.js + Express backend in `server/`
- MySQL stores last 10 searches
- OpenWeatherMap used for current weather

## Run (separate servers)
1. Setup MySQL and create DB/table:
   - Edit `server/.env.example` -> copy to `.env` and fill.
   - Run SQL script:
     ```
     mysql -u root -p < server/init_db.sql
     ```
2. Start backend:
   ```
   cd server
   npm install
   cp .env.example .env
   # edit .env to set values
   npm run dev
   ```
3. Start frontend:
   ```
   cd client
   npm install
   npm run dev
   ```

Frontend dev server will proxy `/api` to backend at http://localhost:5000.

## Notes
- Make sure `OPENWEATHER_API_KEY` is set in server `.env`.
- Ports: frontend 5173, backend 5000 by default.
