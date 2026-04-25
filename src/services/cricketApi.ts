const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cricket-api`;

async function fetchFromApi(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(API_BASE);
  url.searchParams.set("endpoint", endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  };

  try {
    const response = await fetch(url.toString(), { headers });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.error) return null;
    return data;
  } catch {
    return null;
  }
}

export interface LiveMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  live_status?: string;
  venue: string;
  date: string;
  teams: string[];
  teamInfo?: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
    team?: string;
  }>;
  series_id: string;
  series_name: string;
  source?: string;
}

export interface LiveScorecard {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  teamInfo?: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  scorecard?: LiveInnings[];
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
    team?: string;
  }>;
  toss?: string;
  result?: string;
  manOfMatch?: string;
  source?: string;
}

export interface LiveInnings {
  innings_id: number;
  bat_team_name: string;
  bat_team_short: string;
  bowl_team_name: string;
  bowl_team_short: string;
  score: number;
  wkts: number;
  overs: string;
  extras: {
    total: number;
    byes: number;
    leg_byes: number;
    wides: number;
    noballs: number;
    penalty: number;
  };
  batsmen: Array<{
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strike_rate: number;
    dismissal: string;
  }>;
  bowlers: Array<{
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    wides: number;
    noballs: number;
  }>;
  fall_of_wickets: Array<{
    name: string;
    wicket_number: number;
    score: number;
    overs: string;
  }>;
}

export interface LiveCommentary {
  over: string;
  text: string;
  timestamp: string;
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const data = await fetchFromApi("live_matches");
  if (data?.data) return data.data;
  return [];
}

export async function getMatchInfo(matchId: string): Promise<LiveMatch | null> {
  const data = await fetchFromApi("match_info", { id: matchId });
  if (data?.data) return data.data;
  return null;
}

export async function getMatchScorecard(matchId: string): Promise<LiveScorecard | null> {
  const data = await fetchFromApi("match_scorecard", { id: matchId });
  if (data?.data) return data.data;
  return null;
}

export async function getMatchCommentary(matchId: string, inningsId: string = "1"): Promise<LiveCommentary[]> {
  const data = await fetchFromApi("match_commentary", { id: matchId, innings_id: inningsId });
  if (data?.data) return data.data;
  return [];
}

export async function getMatchHighlights(matchId: string, inningsId: string = "1"): Promise<any> {
  const data = await fetchFromApi("match_highlights", { id: matchId, innings_id: inningsId });
  if (data?.data) return data.data;
  return null;
}

export async function getIPLSchedule(): Promise<LiveMatch[]> {
  const data = await fetchFromApi("ipl_schedule");
  if (data?.data) return data.data;
  return [];
}

const TEAM_NAME_MAP: Record<string, string> = {
  "Chennai Super Kings": "CSK",
  "Mumbai Indians": "MI",
  "Royal Challengers Bengaluru": "RCB",
  "Royal Challengers Bangalore": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Delhi Capitals": "DC",
  "Punjab Kings": "PBKS",
  "Rajasthan Royals": "RR",
  "Sunrisers Hyderabad": "SRH",
  "Lucknow Super Giants": "LSG",
  "Gujarat Titans": "GT",
};

export function mapTeamName(name: string): string {
  return TEAM_NAME_MAP[name] || name;
}

export function isApiAvailable(): boolean {
  return !!import.meta.env.VITE_SUPABASE_URL;
}
