# IPL Project - Agent Instructions

## Project Structure
- `frontend/` – React 19 + TypeScript + Vite 6 (port 5173)
- `backend/` – Python FastAPI server
- `database/` – PostgreSQL schema

## Developer Commands

**Frontend:**
```powershell
cd frontend
npm install  # only if node_modules missing
npm run dev   # dev server on port 5173
npm run build # production build
```

**Backend:**
```powershell
cd backend
.\venv\Scripts\activate  # Windows
uvicorn main:app --reload
```

## API Endpoints
- `GET /api/` – API info
- `GET /api/matches` – All matches from database
- `GET /api/live-matches` – Live data from cricket API
- `GET /api/refresh` – Force refresh from API
- `GET /api/status` – API status

## Features
- Live cricket scores from cricketdata.org API
- Auto-refresh every 15 seconds
- WebSocket support at `/ws/live`
- Points table calculated from results

## Tech Stack
- Frontend: React 19, TypeScript, Vite 6, react-router-dom 7
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL (stores cached match data)

## Setup
1. Get free API key from https://cricketdata.org
2. Add to backend/.env: `CRICKET_API_KEY=your_key`
3. Start backend: `uvicorn main:app --reload`
4. Start frontend: `npm run dev`

## Admin
- Login: username=`admin`, password=`ipl2024`
- Dashboard: `/admin/dashboard`

## Notes
- No seed data - all data comes from live API
- WebSocket broadcasts live updates every 30 seconds
- Database stores cached match data for offline access