from fastapi import FastAPI, Query, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
from dotenv import load_dotenv
from typing import Optional
from live_cricket_bridge import (
    LiveCricketSourceError,
    fetch_ipl_overview,
    fetch_live_score,
)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:tejas123@localhost/iplfan")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(String(50), unique=True)
    name = Column(String(100))
    short_name = Column(String(10))
    logo_url = Column(String(500))
    primary_color = Column(String(20))


class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(String(50), unique=True)
    name = Column(String(100))
    team_id = Column(String(50))
    role = Column(String(50))
    batting_style = Column(String(50))
    bowling_style = Column(String(50))
    image_url = Column(String(500))
    jersey_number = Column(Integer)


class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    api_match_id = Column(String(50), unique=True)
    match_name = Column(String(200))
    match_number = Column(Integer)
    date = Column(String(30))
    venue = Column(String(200))
    status = Column(String(20))
    match_type = Column(String(20))
    series_name = Column(String(200))
    team1_id = Column(String(50))
    team1_name = Column(String(100))
    team1_short = Column(String(10))
    team2_id = Column(String(50))
    team2_name = Column(String(100))
    team2_short = Column(String(10))
    team1_score = Column(String(50))
    team1_wickets = Column(Integer)
    team1_overs = Column(Float)
    team2_score = Column(String(50))
    team2_wickets = Column(Integer)
    team2_overs = Column(Float)
    result = Column(String(200))
    winning_team = Column(String(100))
    created_at = Column(String(30), default=lambda: datetime.now().isoformat())


class Scorecard(Base):
    __tablename__ = "scorecards"
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(String(50))
    team_id = Column(String(50))
    team_name = Column(String(100))
    innings = Column(Integer)
    runs = Column(Integer)
    wickets = Column(Integer)
    overs = Column(Float)
    extras = Column(Integer)


class PointsTable(Base):
    __tablename__ = "points_table"
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(String(50))
    team_name = Column(String(100))
    team_short = Column(String(10))
    played = Column(Integer, default=0)
    won = Column(Integer, default=0)
    lost = Column(Integer, default=0)
    tied = Column(Integer, default=0)
    no_result = Column(Integer, default=0)
    points = Column(Integer, default=0)
    net_run_rate = Column(Float, default=0)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="IPL 2026 Live")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_root():
    return {"message": "IPL 2026 Live API", "version": "2.0", "api_key_configured": bool(CRICKET_API_KEY)}


@app.get("/api/matches")
def get_matches():
    db = SessionLocal()
    try:
        matches = db.query(Match).order_by(Match.date.desc()).all()
        return [{
            "id": m.id,
            "api_match_id": m.api_match_id,
            "match_name": m.match_name,
            "match_number": m.match_number,
            "date": m.date,
            "venue": m.venue,
            "status": m.status,
            "match_type": m.match_type,
            "team1": {"id": m.team1_id, "name": m.team1_name, "short": m.team1_short},
            "team2": {"id": m.team2_id, "name": m.team2_name, "short": m.team2_short},
            "team1_score": m.team1_score,
            "team1_wickets": m.team1_wickets,
            "team1_overs": m.team1_overs,
            "team2_score": m.team2_score,
            "team2_wickets": m.team2_wickets,
            "team2_overs": m.team2_overs,
            "result": m.result,
            "winning_team": m.winning_team
        } for m in matches]
    finally:
        db.close()


@app.get("/api/overview")
async def get_overview(year: Optional[int] = Query(default=None, ge=2008, le=2100)):
    try:
        return await fetch_ipl_overview(year)
    except LiveCricketSourceError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "status": "error",
                "message": str(exc),
                "series": None,
                "matches": [],
                "points_table": [],
            },
        )


@app.get("/api/live-score/{match_id}")
async def get_live_score(match_id: str):
    try:
        return await fetch_live_score(match_id)
    except LiveCricketSourceError as exc:
        return JSONResponse(
            status_code=502,
            content={"status": "error", "message": str(exc)},
        )
    except Exception as exc:
        return JSONResponse(
            status_code=422,
            content={"status": "error", "message": str(exc)},
        )


@app.get("/api/matches/{match_id}")
def get_match_details(match_id: str):
    db = SessionLocal()
    try:
        match = db.query(Match).filter(Match.api_match_id == match_id).first()
        if not match:
            return {"error": "Match not found"}
        
        scorecards = db.query(Scorecard).filter(Scorecard.match_id == match_id).all()
        
        return {
            "id": match.id,
            "api_match_id": match.api_match_id,
            "match_name": match.match_name,
            "match_number": match.match_number,
            "date": match.date,
            "venue": match.venue,
            "status": match.status,
            "match_type": match.match_type,
            "team1": {"id": match.team1_id, "name": match.team1_name, "short": match.team1_short, "score": match.team1_score, "wickets": match.team1_wickets, "overs": match.team1_overs},
            "team2": {"id": match.team2_id, "name": match.team2_name, "short": match.team2_short, "score": match.team2_score, "wickets": match.team2_wickets, "overs": match.team2_overs},
            "result": match.result,
            "winning_team": match.winning_team,
            "scorecards": [{"team_name": s.team_name, "innings": s.innings, "runs": s.runs, "wickets": s.wickets, "overs": s.overs, "extras": s.extras} for s in scorecards]
        }
    finally:
        db.close()


@app.post("/api/sync")
async def sync_matches():
    db = SessionLocal()
    try:
        overview = await fetch_ipl_overview()
        saved = 0
        
        for m in overview.get("matches", []):
            match_data = {
                "api_match_id": m.get("summary", "").replace(" ", "_")[:50],
                "match_name": m.get("summary", ""),
                "match_number": saved + 1,
                "date": datetime.now().isoformat(),
                "venue": m.get("venue", "Unknown"),
                "status": m.get("status", "SCHEDULED").upper(),
                "match_type": "T20",
                "series_name": overview.get("series", {}).get("title", "IPL"),
                "team1_id": m.get("team1", ""),
                "team1_name": m.get("team1", ""),
                "team1_short": m.get("team1", ""),
                "team2_id": m.get("team2", ""),
                "team2_name": m.get("team2", ""),
                "team2_short": m.get("team2", ""),
                "team1_score": "",
                "team1_wickets": 0,
                "team1_overs": 0.0,
                "team2_score": "",
                "team2_wickets": 0,
                "team2_overs": 0.0,
                "result": m.get("status", ""),
                "winning_team": ""
            }
            
            existing = db.query(Match).filter(Match.api_match_id == match_data["api_match_id"]).first()
            if existing:
                for k, v in match_data.items():
                    setattr(existing, k, v)
            else:
                db_match = Match(**match_data)
                db.add(db_match)
            saved += 1
        
        db.commit()
        return {"message": f"Synced {saved} matches from scraper"}
    except LiveCricketSourceError as e:
        return {"error": f"Scraper error: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


def update_points_table(db, matches):
    db.query(PointsTable).delete()
    
    team_stats = {}
    
    for m in matches:
        if m.status != "COMPLETED":
            continue
        
        for team, score, wickets in [(m.team1_id, m.team1_score, m.team1_wickets), (m.team2_id, m.team2_score, m.team2_wickets)]:
            if team not in team_stats:
                team_stats[team] = {"name": m.team1_name if team == m.team1_id else m.team2_name, "short": team, "played": 0, "won": 0, "lost": 0, "tied": 0, "nr": 0}
            team_stats[team]["played"] += 1
        
        if m.winning_team:
            winner = m.team1_id if m.winning_team in m.team1_name or m.team1_short in m.winning_team else m.team2_id
            loser = m.team2_id if winner == m.team1_id else m.team1_id
            
            if winner in team_stats:
                team_stats[winner]["won"] += 1
            if loser in team_stats:
                team_stats[loser]["lost"] += 1
    
    for team_id, stats in team_stats.items():
        pt = PointsTable(
            team_id=team_id,
            team_name=stats["name"],
            team_short=stats["short"],
            played=stats["played"],
            won=stats["won"],
            lost=stats["lost"],
            tied=stats["tied"],
            no_result=stats["nr"],
            points=stats["won"] * 2 + stats["nr"]
        )
        db.add(pt)
    
    db.commit()


@app.get("/api/points-table")
async def get_points_table():
    db = SessionLocal()
    try:
        points = db.query(PointsTable).order_by(PointsTable.points.desc()).all()
        if points:
            return [{
                "team_id": p.team_id,
                "team_name": p.team_name,
                "team_short": p.team_short,
                "played": p.played,
                "won": p.won,
                "lost": p.lost,
                "tied": p.tied,
                "no_result": p.no_result,
                "points": p.points,
                "net_run_rate": p.net_run_rate
            } for p in points]
    finally:
        db.close()

    try:
        overview = await fetch_ipl_overview()
        return [{
            "team_id": row["team"],
            "team_name": row["team"],
            "team_short": row["team"],
            "played": row["played"],
            "won": row["won"],
            "lost": row["lost"],
            "tied": 0,
            "no_result": row["no_result"],
            "points": row["points"],
            "net_run_rate": row["net_run_rate"]
        } for row in overview.get("points_table", [])]
    except LiveCricketSourceError:
        return []


@app.get("/api/teams")
def get_teams():
    db = SessionLocal()
    try:
        teams = db.query(Team).all()
        return [{"team_id": t.team_id, "name": t.name, "short_name": t.short_name, "logo_url": t.logo_url, "primary_color": t.primary_color} for t in teams]
    finally:
        db.close()


@app.get("/api/teams/{team_id}")
def get_team_with_players(team_id: str):
    db = SessionLocal()
    try:
        team = db.query(Team).filter(Team.team_id == team_id).first()
        if team:
            players = db.query(Player).filter(Player.team_id == team_id).all()
            return {
                "team_id": team.team_id,
                "name": team.name,
                "short_name": team.short_name,
                "logo_url": team.logo_url,
                "primary_color": team.primary_color,
                "players": [{"player_id": p.player_id, "name": p.name, "role": p.role, "batting_style": p.batting_style, "bowling_style": p.bowling_style, "jersey_number": p.jersey_number, "image_url": p.image_url} for p in players]
            }
        return {"error": "Team not found"}
    finally:
        db.close()


@app.get("/api/players")
def get_all_players():
    db = SessionLocal()
    try:
        players = db.query(Player).all()
        return [{"player_id": p.player_id, "name": p.name, "team_id": p.team_id, "role": p.role, "jersey_number": p.jersey_number} for p in players]
    finally:
        db.close()


@app.post("/api/sync/teams")
def sync_teams():
    db = SessionLocal()
    try:
        db.query(Team).delete()
        
        teams = [
            {"team_id": "RCB", "name": "Royal Challengers Bengaluru", "short_name": "RCB", "primary_color": "#d92b30"},
            {"team_id": "MI", "name": "Mumbai Indians", "short_name": "MI", "primary_color": "#00529f"},
            {"team_id": "CSK", "name": "Chennai Super Kings", "short_name": "CSK", "primary_color": "#fdb913"},
            {"team_id": "DC", "name": "Delhi Capitals", "short_name": "DC", "primary_color": "#0078d4"},
            {"team_id": "KKR", "name": "Kolkata Knight Riders", "short_name": "KKR", "primary_color": "#3a225d"},
            {"team_id": "RR", "name": "Rajasthan Royals", "short_name": "RR", "primary_color": "#ff9933"},
            {"team_id": "PBKS", "name": "Punjab Kings", "short_name": "PBKS", "primary_color": "#ed1c24"},
            {"team_id": "LSG", "name": "Lucknow Super Giants", "short_name": "LSG", "primary_color": "#00a650"},
            {"team_id": "SRH", "name": "Sunrisers Hyderabad", "short_name": "SRH", "primary_color": "#ff4900"},
            {"team_id": "GT", "name": "Gujarat Titans", "short_name": "GT", "primary_color": "#1e2063"},
        ]
        
        for t in teams:
            db.add(Team(**t))
        
        db.commit()
        return {"message": f"Added {len(teams)} teams"}
    finally:
        db.close()


@app.post("/api/sync/players")
def sync_players():
    db = SessionLocal()
    try:
        db.query(Player).delete()
        
        players = [
            {"player_id": "p1", "name": "Virat Kohli", "team_id": "RCB", "role": "Batsman", "batting_style": "Right-hand", "bowling_style": "Leg-break", "jersey_number": 18},
            {"player_id": "p2", "name": "Rohit Sharma", "team_id": "MI", "role": "Batsman", "batting_style": "Right-hand", "bowling_style": "Off-break", "jersey_number": 45},
            {"player_id": "p3", "name": "MS Dhoni", "team_id": "CSK", "role": "Wicket-keeper", "batting_style": "Right-hand", "bowling_style": "Medium", "jersey_number": 7},
            {"player_id": "p4", "name": "Jasprit Bumrah", "team_id": "MI", "role": "Bowler", "batting_style": "Right-hand", "bowling_style": "Fast", "jersey_number": 93},
            {"player_id": "p5", "name": "Ravindra Jadeja", "team_id": "CSK", "role": "All-rounder", "batting_style": "Left-hand", "bowling_style": "Orthodox", "jersey_number": 8},
            {"player_id": "p6", "name": "Hardik Pandya", "team_id": "MI", "role": "All-rounder", "batting_style": "Right-hand", "bowling_style": "Fast-medium", "jersey_number": 99},
            {"player_id": "p7", "name": "Suryakumar Yadav", "team_id": "MI", "role": "Batsman", "batting_style": "Right-hand", "bowling_style": "Leg-break", "jersey_number": 63},
            {"player_id": "p8", "name": "Shubman Gill", "team_id": "GT", "role": "Batsman", "batting_style": "Right-hand", "bowling_style": "Leg-break", "jersey_number": 77},
            {"player_id": "p9", "name": "KL Rahul", "team_id": "LSG", "role": "Wicket-keeper", "batting_style": "Right-hand", "bowling_style": "Off-break", "jersey_number": 1},
            {"player_id": "p10", "name": "Pat Cummins", "team_id": "SRH", "role": "Bowler", "batting_style": "Right-hand", "bowling_style": "Fast", "jersey_number": 18},
            {"player_id": "p11", "name": "Faf du Plessis", "team_id": "RCB", "role": "Batsman", "batting_style": "Right-hand", "bowling_style": "Leg-break", "jersey_number": 18},
            {"player_id": "p12", "name": "Rashid Khan", "team_id": "GT", "role": "Bowler", "batting_style": "Right-hand", "bowling_style": "Leg-spin", "jersey_number": 19},
            {"player_id": "p13", "name": "Shreyas Iyer", "team_id": "KKR", "role": "Batsman", "batting_style": "Right-hand", "bowling_style": "Leg-break", "jersey_number": 24},
            {"player_id": "p14", "name": "Sanju Samson", "team_id": "RR", "role": "Wicket-keeper", "batting_style": "Right-hand", "bowling_style": "Off-break", "jersey_number": 8},
            {"player_id": "p15", "name": "Axar Patel", "team_id": "DC", "role": "All-rounder", "batting_style": "Left-hand", "bowling_style": "Orthodox", "jersey_number": 15},
            {"player_id": "p16", "name": "Kagiso Rabada", "team_id": "PBKS", "role": "Bowler", "batting_style": "Right-hand", "bowling_style": "Fast", "jersey_number": 25},
            {"player_id": "p17", "name": "Yuzvendra Chahal", "team_id": "LSG", "role": "Bowler", "batting_style": "Right-hand", "bowling_style": "Leg-spin", "jersey_number": 3},
            {"player_id": "p18", "name": "Mohammed Siraj", "team_id": "RCB", "role": "Bowler", "batting_style": "Right-hand", "bowling_style": "Fast", "jersey_number": 13},
            {"player_id": "p19", "name": "Andre Russell", "team_id": "KKR", "role": "All-rounder", "batting_style": "Right-hand", "bowling_style": "Fast", "jersey_number": 99},
            {"player_id": "p20", "name": "Devon Conway", "team_id": "CSK", "role": "Batsman", "batting_style": "Left-hand", "bowling_style": "Medium", "jersey_number": 88},
        ]
        
        for p in players:
            db.add(Player(**p))
        
        db.commit()
        return {"message": f"Added {len(players)} players"}
    finally:
        db.close()


@app.get("/api/status")
async def get_status():
    db = SessionLocal()
    try:
        match_count = db.query(Match).count()
        team_count = db.query(Team).count()
        player_count = db.query(Player).count()
        
        live = db.query(Match).filter(Match.status == "LIVE").count()
        upcoming = db.query(Match).filter(Match.status == "SCHEDULED").count()
        completed = db.query(Match).filter(Match.status == "COMPLETED").count()
        
        status_payload = {
            "scraper": "live-cricket-score-api",
            "matches": match_count,
            "teams": team_count,
            "players": player_count,
            "live_matches": live,
            "upcoming_matches": upcoming,
            "completed_matches": completed
        }
    finally:
        db.close()

    try:
        overview = await fetch_ipl_overview()
        status_payload["scraper_info"] = {
            "available": True,
            "season": overview["series"]["title"],
            "scheduled_matches": len(overview.get("matches", [])),
            "points_rows": len(overview.get("points_table", [])),
        }
    except LiveCricketSourceError as exc:
        status_payload["scraper_info"] = {
            "available": False,
            "message": str(exc),
        }

    return status_payload
