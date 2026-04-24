export interface MatchRecord {
  id: number
  api_match_id: string
  match_name: string
  match_number: number
  date: string
  venue: string
  status: string
  match_type: string
  team1: { id: string; name: string; short: string }
  team2: { id: string; name: string; short: string }
  team1_score: string
  team1_wickets: number
  team1_overs: number
  team2_score: string
  team2_wickets: number
  team2_overs: number
  result: string
  winning_team: string
}

export interface MatchDetailRecord {
  id: number
  api_match_id: string
  match_name: string
  match_number?: number
  date: string
  venue: string
  status: string
  match_type: string
  team1: {
    id: string
    name: string
    short: string
    score: string
    wickets: number
    overs: number
  }
  team2: {
    id: string
    name: string
    short: string
    score: string
    wickets: number
    overs: number
  }
  result: string
  winning_team: string
  scorecards: Array<{
    team_name: string
    innings: number
    runs: number
    wickets: number
    overs: number
    extras: number
  }>
}

export interface OverviewMatch {
  summary: string
  label: string
  venue: string
  team1: string
  team2: string
  status: string
}

export interface PointsRow {
  team_id: string
  team_name: string
  team_short: string
  played: number
  won: number
  lost: number
  tied: number
  no_result: number
  points: number
  net_run_rate: number | string
}

export interface OverviewResponse {
  status: string
  series: {
    series_id: number
    title: string
    year: number
    slug: string
    series_url: string
  } | null
  matches: OverviewMatch[]
  points_table: Array<{
    rank: number
    team: string
    played: number
    won: number
    lost: number
    no_result: number
    points: number
    net_run_rate: string
  }>
  message?: string
}

export interface TeamRecord {
  team_id: string
  name: string
  short_name: string
  logo_url?: string
  primary_color?: string
}

export interface PlayerRecord {
  player_id: string
  name: string
  team_id: string
  role: string
  batting_style?: string
  bowling_style?: string
  jersey_number: number
}

export interface SiteStatus {
  api_key_configured: boolean
  matches: number
  teams: number
  players: number
  live_matches: number
  upcoming_matches: number
  completed_matches: number
  scraper?: {
    available: boolean
    season?: string
    scheduled_matches?: number
    points_rows?: number
    message?: string
  }
}

export interface TeamMeta {
  code: string
  name: string
  color: string
  accent: string
}

export const TEAM_META: Record<string, TeamMeta> = {
  RCB: { code: 'RCB', name: 'Royal Challengers Bengaluru', color: '#c51f2f', accent: '#ffd166' },
  MI: { code: 'MI', name: 'Mumbai Indians', color: '#0058a8', accent: '#7dc8ff' },
  CSK: { code: 'CSK', name: 'Chennai Super Kings', color: '#f4c430', accent: '#0d1b2a' },
  DC: { code: 'DC', name: 'Delhi Capitals', color: '#0f5db8', accent: '#e74c3c' },
  KKR: { code: 'KKR', name: 'Kolkata Knight Riders', color: '#3c1b67', accent: '#d4af37' },
  RR: { code: 'RR', name: 'Rajasthan Royals', color: '#ff4f8b', accent: '#17324d' },
  PBKS: { code: 'PBKS', name: 'Punjab Kings', color: '#d7263d', accent: '#f7f7f7' },
  LSG: { code: 'LSG', name: 'Lucknow Super Giants', color: '#00a5cf', accent: '#fcbf49' },
  SRH: { code: 'SRH', name: 'Sunrisers Hyderabad', color: '#f97316', accent: '#2f2f2f' },
  GT: { code: 'GT', name: 'Gujarat Titans', color: '#16213e', accent: '#74c0fc' },
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed for ${url}`)
  }
  return response.json() as Promise<T>
}

export function inferMatchState(status: string): 'live' | 'upcoming' | 'completed' {
  const value = status.toLowerCase()

  if (
    value.includes('won') ||
    value.includes('beat') ||
    value.includes('tied') ||
    value.includes('abandoned') ||
    value.includes('no result') ||
    value.includes('completed')
  ) {
    return 'completed'
  }

  if (
    value.includes('start') ||
    value.includes('scheduled') ||
    value.includes('yet to begin') ||
    value.includes('upcoming') ||
    value.includes('toss')
  ) {
    return 'upcoming'
  }

  return 'live'
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions) {
  if (!dateStr) return 'TBA'

  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr

  return new Intl.DateTimeFormat('en-IN', options ?? {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getTeamMeta(code: string, fallbackName?: string): TeamMeta {
  const normalized = code.toUpperCase()
  return TEAM_META[normalized] ?? {
    code: normalized,
    name: fallbackName ?? normalized,
    color: '#1f3a5f',
    accent: '#d9e2ec',
  }
}

export function pointsTableToRows(overview: OverviewResponse | null): PointsRow[] {
  if (!overview?.points_table?.length) return []

  return overview.points_table.map((row) => ({
    team_id: row.team,
    team_name: row.team,
    team_short: row.team,
    played: row.played,
    won: row.won,
    lost: row.lost,
    tied: 0,
    no_result: row.no_result,
    points: row.points,
    net_run_rate: row.net_run_rate,
  }))
}
