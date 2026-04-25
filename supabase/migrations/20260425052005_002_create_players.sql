/*
  # Create players table

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `name` (text, player full name)
      - `team_id` (uuid, foreign key to teams)
      - `role` (text: batsman/bowler/all-rounder/wicket-keeper)
      - `nationality` (text, country)
      - `batting_style` (text, e.g. Right-hand bat)
      - `bowling_style` (text, e.g. Right-arm fast)
      - `date_of_birth` (date)
      - `image_url` (text, URL to player photo)
      - `jersey_number` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `players` table
    - Public read access
*/

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'batsman' CHECK (role IN ('batsman', 'bowler', 'all-rounder', 'wicket-keeper')),
  nationality text NOT NULL DEFAULT '',
  batting_style text NOT NULL DEFAULT '',
  bowling_style text NOT NULL DEFAULT '',
  date_of_birth date,
  image_url text NOT NULL DEFAULT '',
  jersey_number integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view players"
  ON players FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add captain FK to teams now that players table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'teams_captain_id_fkey'
  ) THEN
    ALTER TABLE teams ADD CONSTRAINT teams_captain_id_fkey
      FOREIGN KEY (captain_id) REFERENCES players(id);
  END IF;
END $$;
