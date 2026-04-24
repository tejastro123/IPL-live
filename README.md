# IPL Fan Website

## Project Structure
- `frontend/` – React app for user and admin interfaces
- `backend/` – Python API server (connects to PostgreSQL, ingests free IPL APIs, exposes endpoints)
- `database/` – PostgreSQL setup and seed scripts
- `.github/` – Copilot instructions and project automation

## MVP Features
### User-Facing
- Home page: IPL news, schedule, and quick stats
- Teams & Players: List, details, and stats
- Match Center: Live scores (from free APIs), results, fixtures
- Points Table: Standings
- Search: Teams, players, matches

### Admin
- Secure login for admin
- CRUD (Create, Read, Update, Delete) for:
  - Teams
  - Players
  - Matches
  - Scores
  - News/updates
- Manual override for API data

## Tech Stack
- **Frontend:** React (JavaScript/TypeScript)
- **Backend:** Python (FastAPI or Flask recommended)
- **Database:** PostgreSQL (local)
- **APIs:** Free IPL APIs for ingesting live data

## Development Plan
1. Scaffold backend (Python API, DB models, endpoints)
2. Scaffold frontend (React app, routing, basic pages)
3. Set up PostgreSQL schema and seed data
4. Integrate free IPL APIs (backend)
5. Build admin interface (frontend + backend auth)
6. Connect frontend to backend APIs
7. Testing and documentation

## Setup Instructions
- See README.md in each folder for setup details.
- Use `.env` files for local configuration.

---
This plan covers the MVP and tech stack. Next, backend and frontend scaffolding will begin.