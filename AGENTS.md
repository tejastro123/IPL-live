# IPL Project - Agent Instructions

## Project Structure
- `frontend/` – React 19 + TypeScript + Vite 6 (port 5173)
- `backend/` – Python FastAPI + SQLAlchemy
- `database/` – PostgreSQL schema only (no seed data)

## Developer Commands

**Frontend:**
```powershell
cd frontend
npm install  # only if node_modules missing
npm run dev   # dev server on port 5173
npm run build # production build
npm run lint # ESLint check
```

**Backend (Windows):**
```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

## Key Endpoints
- `GET /api/` – API info
- `GET /api/matches` – Cached matches from database
- `GET /api/live-matches` – Live data from cricketdata.org
- `GET /api/refresh` – Force refresh from API
- `GET /api/status` – API status

## Admin
- Login: `admin` / `ipl2024`
- Dashboard: `/admin/dashboard`

## Notes
- All data comes from live API (cricketdata.org) – no seed data
- API key already configured in `backend/.env`
- WebSocket at `/ws/live` broadcasts updates every 30 seconds
- Database stores cached match data for offline access