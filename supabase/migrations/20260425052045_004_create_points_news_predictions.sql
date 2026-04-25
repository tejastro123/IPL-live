/*
  # Create points table, news, predictions, and user profiles

  1. New Tables
    - `points_table`
      - `id` (uuid, primary key)
      - `season` (integer)
      - `team_id` (uuid, FK to teams)
      - `matches_played` (integer)
      - `won` (integer)
      - `lost` (integer)
      - `tied` (integer)
      - `no_result` (integer)
      - `points` (integer)
      - `net_run_rate` (numeric(7,3))
      - `position` (integer)
      - `recent_form` (text, e.g. "W,L,W,W,L")
      - `created_at` (timestamptz)

    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique, URL-friendly)
      - `content` (text, full article content)
      - `category` (text: match-report/transfer/breaking/analysis)
      - `image_url` (text)
      - `published_at` (timestamptz)
      - `author` (text)
      - `is_featured` (boolean)
      - `created_at` (timestamptz)

    - `predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users)
      - `match_id` (uuid, FK to matches)
      - `predicted_winner_id` (uuid, FK to teams)
      - `team_a_score` (text, predicted score)
      - `team_b_score` (text, predicted score)
      - `points_earned` (integer, default 0)
      - `created_at` (timestamptz)

    - `user_profiles`
      - `id` (uuid, primary key, FK to auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `avatar_url` (text)
      - `favorite_team_id` (uuid, FK to teams)
      - `prediction_points` (integer, default 0)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read for points_table and news
    - Authenticated users can manage own predictions and profile
*/

CREATE TABLE IF NOT EXISTS points_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season integer NOT NULL DEFAULT 2026,
  team_id uuid NOT NULL REFERENCES teams(id),
  matches_played integer NOT NULL DEFAULT 0,
  won integer NOT NULL DEFAULT 0,
  lost integer NOT NULL DEFAULT 0,
  tied integer NOT NULL DEFAULT 0,
  no_result integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 0,
  net_run_rate numeric(7,3) NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0,
  recent_form text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'match-report' CHECK (category IN ('match-report', 'transfer', 'breaking', 'analysis')),
  image_url text NOT NULL DEFAULT '',
  published_at timestamptz DEFAULT now(),
  author text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id uuid NOT NULL REFERENCES matches(id),
  predicted_winner_id uuid NOT NULL REFERENCES teams(id),
  team_a_score text,
  team_b_score text,
  points_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  favorite_team_id uuid REFERENCES teams(id),
  prediction_points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE points_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view points table"
  ON points_table FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can view news"
  ON news FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all predictions for match"
  ON predictions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions"
  ON predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_points_table_season ON points_table(season);
CREATE INDEX IF NOT EXISTS idx_points_table_team ON points_table(team_id);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
