/*
  # Create matches and related tables

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `match_number` (integer, sequential match number in season)
      - `season` (integer, e.g. 2026)
      - `date` (date, match date)
      - `time_gmt` (text, match time in GMT)
      - `venue` (text, stadium name)
      - `city` (text, match city)
      - `home_team_id` (uuid, FK to teams)
      - `away_team_id` (uuid, FK to teams)
      - `status` (text: upcoming/live/completed)
      - `toss_winner_id` (uuid, FK to teams)
      - `toss_decision` (text: bat/field)
      - `result_description` (text, e.g. "CSK won by 5 wickets")
      - `winner_id` (uuid, FK to teams)
      - `man_of_the_match_id` (uuid, FK to players)
      - `result_margin` (text, e.g. "5 wickets" or "12 runs")
      - `created_at` (timestamptz)

    - `match_innings`
      - `id` (uuid, primary key)
      - `match_id` (uuid, FK to matches)
      - `innings_number` (integer, 1 or 2)
      - `batting_team_id` (uuid, FK to teams)
      - `bowling_team_id` (uuid, FK to teams)
      - `total_runs` (integer)
      - `wickets_lost` (integer)
      - `overs_bowled` (numeric(5,1))
      - `extras_total` (integer)
      - `created_at` (timestamptz)

    - `innings_batsmen`
      - `id` (uuid, primary key)
      - `innings_id` (uuid, FK to match_innings)
      - `player_id` (uuid, FK to players)
      - `player_name` (text, denormalized for performance)
      - `runs_scored` (integer)
      - `balls_faced` (integer)
      - `fours` (integer)
      - `sixes` (integer)
      - `dismissal` (text, e.g. "c Dhoni b Chahar" or "not out")
      - `strike_rate` (numeric(7,2))
      - `batting_order` (integer)
      - `created_at` (timestamptz)

    - `innings_bowlers`
      - `id` (uuid, primary key)
      - `innings_id` (uuid, FK to match_innings)
      - `player_id` (uuid, FK to players)
      - `player_name` (text, denormalized)
      - `overs_bowled` (numeric(5,1))
      - `maidens` (integer)
      - `runs_conceded` (integer)
      - `wickets_taken` (integer)
      - `economy` (numeric(7,2))
      - `created_at` (timestamptz)

    - `ball_by_ball`
      - `id` (uuid, primary key)
      - `match_id` (uuid, FK to matches)
      - `innings_id` (uuid, FK to match_innings)
      - `over_number` (integer)
      - `ball_number` (integer)
      - `batsman_id` (uuid, FK to players)
      - `bowler_id` (uuid, FK to players)
      - `runs_scored` (integer)
      - `is_wicket` (boolean)
      - `wicket_type` (text)
      - `dismissal_batsman_id` (uuid, FK to players)
      - `is_four` (boolean)
      - `is_six` (boolean)
      - `extras_type` (text, e.g. "wide", "noball")
      - `extras_runs` (integer)
      - `commentary_text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for all
*/

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_number integer NOT NULL,
  season integer NOT NULL DEFAULT 2026,
  date date NOT NULL,
  time_gmt text NOT NULL DEFAULT '',
  venue text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  home_team_id uuid NOT NULL REFERENCES teams(id),
  away_team_id uuid NOT NULL REFERENCES teams(id),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  toss_winner_id uuid REFERENCES teams(id),
  toss_decision text CHECK (toss_decision IN ('bat', 'field')),
  result_description text,
  winner_id uuid REFERENCES teams(id),
  man_of_the_match_id uuid REFERENCES players(id),
  result_margin text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS match_innings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  innings_number integer NOT NULL DEFAULT 1,
  batting_team_id uuid NOT NULL REFERENCES teams(id),
  bowling_team_id uuid NOT NULL REFERENCES teams(id),
  total_runs integer NOT NULL DEFAULT 0,
  wickets_lost integer NOT NULL DEFAULT 0,
  overs_bowled numeric(5,1) NOT NULL DEFAULT 0,
  extras_total integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS innings_batsmen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  innings_id uuid NOT NULL REFERENCES match_innings(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id),
  player_name text NOT NULL DEFAULT '',
  runs_scored integer NOT NULL DEFAULT 0,
  balls_faced integer NOT NULL DEFAULT 0,
  fours integer NOT NULL DEFAULT 0,
  sixes integer NOT NULL DEFAULT 0,
  dismissal text NOT NULL DEFAULT 'not out',
  strike_rate numeric(7,2) NOT NULL DEFAULT 0,
  batting_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS innings_bowlers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  innings_id uuid NOT NULL REFERENCES match_innings(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id),
  player_name text NOT NULL DEFAULT '',
  overs_bowled numeric(5,1) NOT NULL DEFAULT 0,
  maidens integer NOT NULL DEFAULT 0,
  runs_conceded integer NOT NULL DEFAULT 0,
  wickets_taken integer NOT NULL DEFAULT 0,
  economy numeric(7,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ball_by_ball (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  innings_id uuid NOT NULL REFERENCES match_innings(id) ON DELETE CASCADE,
  over_number integer NOT NULL DEFAULT 0,
  ball_number integer NOT NULL DEFAULT 0,
  batsman_id uuid NOT NULL REFERENCES players(id),
  bowler_id uuid NOT NULL REFERENCES players(id),
  runs_scored integer NOT NULL DEFAULT 0,
  is_wicket boolean NOT NULL DEFAULT false,
  wicket_type text,
  dismissal_batsman_id uuid REFERENCES players(id),
  is_four boolean NOT NULL DEFAULT false,
  is_six boolean NOT NULL DEFAULT false,
  extras_type text,
  extras_runs integer NOT NULL DEFAULT 0,
  commentary_text text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_innings ENABLE ROW LEVEL SECURITY;
ALTER TABLE innings_batsmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE innings_bowlers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ball_by_ball ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can view match innings"
  ON match_innings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can view innings batsmen"
  ON innings_batsmen FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can view innings bowlers"
  ON innings_bowlers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can view ball by ball"
  ON ball_by_ball FOR SELECT TO anon, authenticated USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_matches_season ON matches(season);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_match_innings_match ON match_innings(match_id);
CREATE INDEX IF NOT EXISTS idx_innings_batsmen_innings ON innings_batsmen(innings_id);
CREATE INDEX IF NOT EXISTS idx_innings_bowlers_innings ON innings_bowlers(innings_id);
CREATE INDEX IF NOT EXISTS idx_ball_by_ball_match ON ball_by_ball(match_id);
CREATE INDEX IF NOT EXISTS idx_ball_by_ball_innings ON ball_by_ball(innings_id);
