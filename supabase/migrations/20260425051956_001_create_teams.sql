/*
  # Create teams table

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, team full name)
      - `short_name` (text, 2-4 letter abbreviation)
      - `city` (text, home city)
      - `color_primary` (text, hex color)
      - `color_secondary` (text, hex color)
      - `logo_url` (text, URL to team logo)
      - `home_venue` (text, home stadium name)
      - `owner` (text, franchise owner)
      - `coach_name` (text, head coach)
      - `captain_id` (uuid, references players - set later)
      - `titles_won` (integer, number of IPL titles)
      - `seasons_played` (integer, number of seasons)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `teams` table
    - Public read access for all users
    - No insert/update/delete for public or authenticated users (admin-managed)
*/

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text NOT NULL,
  city text NOT NULL DEFAULT '',
  color_primary text NOT NULL DEFAULT '#000000',
  color_secondary text NOT NULL DEFAULT '#FFFFFF',
  logo_url text NOT NULL DEFAULT '',
  home_venue text NOT NULL DEFAULT '',
  owner text NOT NULL DEFAULT '',
  coach_name text NOT NULL DEFAULT '',
  captain_id uuid,
  titles_won integer NOT NULL DEFAULT 0,
  seasons_played integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  TO anon, authenticated
  USING (true);
