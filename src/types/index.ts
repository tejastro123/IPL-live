export interface Team {
  id: string;
  name: string;
  short_name: string;
  city: string;
  color_primary: string;
  color_secondary: string;
  logo_url: string;
  home_venue: string;
  owner: string;
  coach_name: string;
  captain_id: string | null;
  titles_won: number;
  seasons_played: number;
}

export interface Player {
  id: string;
  name: string;
  team_id: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  nationality: string;
  batting_style: string;
  bowling_style: string;
  date_of_birth: string;
  image_url: string;
  jersey_number: number;
}

export interface Match {
  id: string;
  match_number: number;
  season: number;
  date: string;
  time_gmt: string;
  venue: string;
  city: string;
  home_team_id: string;
  away_team_id: string;
  status: 'upcoming' | 'live' | 'completed';
  toss_winner_id: string | null;
  toss_decision: string | null;
  result_description: string | null;
  winner_id: string | null;
  man_of_the_match_id: string | null;
  result_margin: string | null;
  home_team?: Team;
  away_team?: Team;
  innings?: MatchInnings[];
  match_innings?: MatchInnings[];
}

export interface MatchInnings {
  id: string;
  match_id: string;
  innings_number: number;
  batting_team_id: string;
  bowling_team_id: string;
  total_runs: number;
  wickets_lost: number;
  overs_bowled: number;
  extras_total: number;
  batting_team?: Team;
  bowling_team?: Team;
  innings_batsmen?: InningsBatsman[];
  innings_bowlers?: InningsBowler[];
  batsmen?: InningsBatsman[];
  bowlers?: InningsBowler[];
}

export interface InningsBatsman {
  id: string;
  innings_id: string;
  player_id: string;
  player_name: string;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  dismissal: string;
  strike_rate: number;
}

export interface InningsBowler {
  id: string;
  innings_id: string;
  player_id: string;
  player_name: string;
  overs_bowled: number;
  maidens: number;
  runs_conceded: number;
  wickets_taken: number;
  economy: number;
}

export interface BallByBall {
  id: string;
  match_id: string;
  innings_id: string;
  over_number: number;
  ball_number: number;
  batsman_id: string;
  bowler_id: string;
  runs_scored: number;
  is_wicket: boolean;
  wicket_type: string | null;
  dismissal_batsman_id: string | null;
  is_four: boolean;
  is_six: boolean;
  extras_type: string | null;
  extras_runs: number;
  commentary_text: string;
}

export interface PlayerMatchStats {
  id: string;
  match_id: string;
  player_id: string;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  wickets_taken: number;
  runs_conceded: number;
  overs_bowled: number;
  maidens: number;
  catches: number;
  stumpings: number;
  run_outs: number;
}

export interface PointsTableEntry {
  id: string;
  season: number;
  team_id: string;
  matches_played: number;
  won: number;
  lost: number;
  tied: number;
  no_result: number;
  points: number;
  net_run_rate: number;
  position: number;
  team?: Team;
  recent_form?: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: 'match-report' | 'transfer' | 'breaking' | 'analysis';
  image_url: string;
  published_at: string;
  author: string;
  is_featured: boolean;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  predicted_winner_id: string;
  team_a_score: string | null;
  team_b_score: string | null;
  created_at: string;
  points_earned: number;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  favorite_team_id: string | null;
  prediction_points: number;
  created_at: string;
}
