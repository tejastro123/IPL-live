-- IPL Fan Website Enhanced Database Schema

-- Teams Table with extended info
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10) UNIQUE,
    city VARCHAR(100),
    home_venue VARCHAR(200),
    captain VARCHAR(100),
    owner VARCHAR(200),
    coach VARCHAR(100),
    founded_year INT,
    logo_url VARCHAR(500),
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players Table with detailed stats
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team_id INT REFERENCES teams(id) ON DELETE SET NULL,
    role VARCHAR(50),
    batting_style VARCHAR(50),
    bowling_style VARCHAR(50),
    nationality VARCHAR(50),
    dob DATE,
    image_url VARCHAR(500),
    jersey_number INT,
    total_runs INT DEFAULT 0,
    total_wickets INT DEFAULT 0,
    matches_played INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match Status Enum
CREATE TYPE match_status AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'ABANDONED', 'NO_RESULT');

-- Matches Table with live score support
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    match_number INT,
    match_type VARCHAR(20) DEFAULT 'LEAGUE',
    date TIMESTAMP NOT NULL,
    team1_id INT REFERENCES teams(id) ON DELETE SET NULL,
    team2_id INT REFERENCES teams(id) ON DELETE SET NULL,
    venue VARCHAR(200),
    toss_winner_id INT REFERENCES teams(id),
    toss_decision VARCHAR(10),
    status match_status DEFAULT 'SCHEDULED',
    result VARCHAR(200),
    winner_id INT REFERENCES teams(id),
    current_score1 VARCHAR(50),
    current_score2 VARCHAR(50),
    overs1 FLOAT,
    overs2 FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match Innings Scores
CREATE TABLE IF NOT EXISTS match_scores (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    innings_number INT,
    runs INT DEFAULT 0,
    wickets INT DEFAULT 0,
    overs_batted FLOAT DEFAULT 0,
    batting_20 VARCHAR(5),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Points Table (pre-calculated standings)
CREATE TABLE IF NOT EXISTS points_table (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    lost INT DEFAULT 0,
    tied INT DEFAULT 0,
    no_result INT DEFAULT 0,
    points INT DEFAULT 0,
    net_run_rate FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News Table with extended fields
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    summary VARCHAR(500),
    image_url VARCHAR(500),
    category VARCHAR(50),
    source VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Match Stats (for live match tracking)
CREATE TABLE IF NOT EXISTS player_match_stats (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    runs_scored INT DEFAULT 0,
    balls_faced INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    overs_bowled FLOAT DEFAULT 0,
    wickets_taken INT DEFAULT 0,
    maidens INT DEFAULT 0,
    runs_conceded INT DEFAULT 0,
    is_out BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_scores_match ON match_scores(match_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_points_table_updated_at BEFORE UPDATE ON points_table FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();