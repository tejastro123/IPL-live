import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  getLiveMatches,
  getMatchScorecard,
  getMatchCommentary,
  getIPLSchedule,
  mapTeamName,
  type LiveMatch,
  type LiveScorecard,
  type LiveCommentary,
} from '../services/cricketApi';
import type { Team, Player, Match, MatchInnings, PointsTableEntry, NewsArticle } from '../types';

export function useLiveMatchesWithFallback() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [localMatches, setLocalMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLive, setUsingLive] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      // Try Cricbuzz live API first
      try {
        const live = await getLiveMatches();
        if (live && live.length > 0) {
          setLiveMatches(live);
          setUsingLive(true);
        }
      } catch {
        // Live API failed, will use local
      }

      // Always fetch local data as fallback/supplement
      const { data } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:home_team_id(id, name, short_name, city, color_primary, color_secondary, titles_won),
          away_team:away_team_id(id, name, short_name, city, color_primary, color_secondary, titles_won),
          match_innings(id, innings_number, batting_team_id, bowling_team_id, total_runs, wickets_lost, overs_bowled)
        `)
        .order('date');

      if (data) setLocalMatches(data as unknown as Match[]);
      setLoading(false);
    };

    fetch();

    // Poll live matches every 30 seconds
    const interval = setInterval(async () => {
      try {
        const live = await getLiveMatches();
        if (live && live.length > 0) {
          setLiveMatches(live);
          setUsingLive(true);
        }
      } catch {
        // Silently fail on polling
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Merge live and local data
  const mergedMatches = usingLive && liveMatches.length > 0
    ? mergeLiveWithLocal(liveMatches, localMatches)
    : localMatches;

  return { matches: mergedMatches, liveMatches, localMatches, loading, usingLive };
}

function mergeLiveWithLocal(live: LiveMatch[], local: Match[]): any[] {
  const result: any[] = [];

  // Add live matches first
  for (const lm of live) {
    const teamShorts = lm.teamInfo?.map(t => t.shortname) || lm.teams?.map(mapTeamName) || [];
    const localMatch = local.find((m: any) => {
      const homeShort = m.home_team?.short_name;
      const awayShort = m.away_team?.short_name;
      return (
        teamShorts.includes(homeShort) &&
        teamShorts.includes(awayShort)
      );
    });

    // Build score data from Cricbuzz format
    const liveScores: Record<string, { runs: number; wickets: number; overs: number }> = {};
    if (lm.score) {
      for (const s of lm.score) {
        const teamKey = s.team || s.inning?.split(' ')[0] || '';
        if (!liveScores[teamKey] || s.o > (liveScores[teamKey]?.overs || 0)) {
          liveScores[teamKey] = { runs: s.r, wickets: s.w, overs: s.o };
        }
      }
    }

    result.push({
      ...localMatch,
      id: localMatch?.id || lm.id,
      status: lm.status === 'live' ? 'live' : lm.status === 'completed' ? 'completed' : 'upcoming',
      live_status: lm.live_status || lm.status,
      live_scores: lm.score,
      live_teams: lm.teamInfo,
      live_name: lm.name,
      source: 'live' as const,
      // Override innings with live data if available
      match_innings: localMatch?.match_innings || [],
      _liveScoreMap: liveScores,
    });
  }

  // Add local matches not already covered by live data
  const liveTeamCombos = new Set(
    live.map((lm) => {
      const shorts = lm.teamInfo?.map(t => t.shortname) || lm.teams?.map(mapTeamName) || [];
      return shorts.sort().join('-');
    })
  );

  for (const m of local) {
    const key = [m.home_team?.short_name, m.away_team?.short_name].sort().join('-');
    if (!liveTeamCombos.has(key)) {
      result.push({ ...m, source: 'local' as const });
    }
  }

  return result;
}

export function useLiveScorecardWithFallback(matchId: string) {
  const [liveScorecard, setLiveScorecard] = useState<LiveScorecard | null>(null);
  const [localMatch, setLocalMatch] = useState<Match | null>(null);
  const [localInnings, setLocalInnings] = useState<MatchInnings[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLive, setUsingLive] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!matchId) { setLoading(false); return; }
      setLoading(true);

      // Try Cricbuzz scorecard
      try {
        const live = await getMatchScorecard(matchId);
        if (live) {
          setLiveScorecard(live);
          setUsingLive(true);
        }
      } catch {
        // Will use local
      }

      // Fetch local data
      const [matchRes, inningsRes] = await Promise.all([
        supabase
          .from('matches')
          .select(`
            *,
            home_team:home_team_id(id, name, short_name, city, color_primary, color_secondary, titles_won),
            away_team:away_team_id(id, name, short_name, city, color_primary, color_secondary, titles_won)
          `)
          .eq('id', matchId)
          .maybeSingle(),
        supabase
          .from('match_innings')
          .select(`
            *,
            batting_team:batting_team_id(id, name, short_name, color_primary),
            bowling_team:bowling_team_id(id, name, short_name, color_primary),
            innings_batsmen(*),
            innings_bowlers(*)
          `)
          .eq('match_id', matchId)
          .order('innings_number'),
      ]);

      if (matchRes.data) setLocalMatch(matchRes.data as unknown as Match);
      if (inningsRes.data) setLocalInnings(inningsRes.data as unknown as MatchInnings[]);
      setLoading(false);
    };

    fetch();

    // Poll live scorecard every 15 seconds
    const interval = setInterval(async () => {
      try {
        const live = await getMatchScorecard(matchId);
        if (live) {
          setLiveScorecard(live);
          setUsingLive(true);
        }
      } catch {
        // Silently fail
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [matchId]);

  return { liveScorecard, localMatch, localInnings, loading, usingLive };
}

export function useLiveCommentary(matchId: string) {
  const [commentary, setCommentary] = useState<LiveCommentary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) { setLoading(false); return; }

    const fetch = async () => {
      try {
        const data = await getMatchCommentary(matchId);
        if (data && data.length > 0) {
          setCommentary(data);
        }
      } catch {
        // Will use local ball-by-ball
      }
      setLoading(false);
    };

    fetch();

    const interval = setInterval(async () => {
      try {
        const data = await getMatchCommentary(matchId);
        if (data && data.length > 0) {
          setCommentary(data);
        }
      } catch {
        // Silently fail
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [matchId]);

  return { commentary, loading };
}

export function useIPLSchedule() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLive, setUsingLive] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getIPLSchedule();
        if (data && data.length > 0) {
          setMatches(data);
          setUsingLive(true);
        }
      } catch {
        // Will use local
      }
      setLoading(false);
    };

    fetch();
  }, []);

  return { matches, loading, usingLive };
}

// Keep existing hooks for local Supabase data
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('teams').select('*').order('name').then(({ data, error }) => {
      if (error) { setError(error.message); }
      else if (data) { setTeams(data as Team[]); }
      setLoading(false);
    });
  }, []);

  return { teams, loading, error };
}

export function useTeam(id: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('teams').select('*, captain:captain_id(id, name)').eq('id', id).maybeSingle()
      .then(({ data }) => { if (data) setTeam(data as any); setLoading(false); });
  }, [id]);

  return { team, loading };
}

export function usePlayers(teamId?: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('players').select('*, team:teams(id, name, short_name, color_primary)');
    if (teamId) query = query.eq('team_id', teamId);
    query.order('name').then(({ data }) => { if (data) setPlayers(data as any[]); setLoading(false); });
  }, [teamId]);

  return { players, loading };
}

export function usePointsTable() {
  const [entries, setEntries] = useState<PointsTableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('points_table').select('*, team:team_id(id, name, short_name, color_primary, color_secondary, titles_won)')
      .eq('season', 2026).order('position').then(({ data }) => {
        if (data) setEntries(data as unknown as PointsTableEntry[]);
        setLoading(false);
      });
  }, []);

  return { entries, loading };
}

export function useNews(category?: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('news').select('*').order('published_at', { ascending: false });
    if (category) query = query.eq('category', category);
    query.limit(20).then(({ data }) => { if (data) setArticles(data as NewsArticle[]); setLoading(false); });
  }, [category]);

  return { articles, loading };
}

export function useNewsArticle(slug: string) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from('news').select('*').eq('slug', slug).maybeSingle()
      .then(({ data }) => { if (data) setArticle(data as NewsArticle); setLoading(false); });
  }, [slug]);

  return { article, loading };
}

export function usePredictions(matchId?: string) {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('predictions').select('*');
    if (matchId) query = query.eq('match_id', matchId);
    query.then(({ data }) => { if (data) setPredictions(data); setLoading(false); });
  }, [matchId]);

  return { predictions, loading };
}

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data); setLoading(false); });
  }, [userId]);

  return { profile, loading };
}

export function useMatches(status?: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase
      .from('matches')
      .select(`
        *,
        home_team:home_team_id(id, name, short_name, city, color_primary, color_secondary, titles_won),
        away_team:away_team_id(id, name, short_name, city, color_primary, color_secondary, titles_won),
        match_innings(id, innings_number, batting_team_id, bowling_team_id, total_runs, wickets_lost, overs_bowled)
      `)
      .order('date');

    if (status) query = query.eq('status', status);

    query.then(({ data, error }) => {
      if (error) { console.error('Error fetching matches:', error); }
      else if (data) { setMatches(data as unknown as Match[]); }
      setLoading(false);
    });
  }, [status]);

  return { matches, loading };
}

export function useBallByBall(matchId: string) {
  const [balls, setBalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    supabase.from('ball_by_ball').select('*').eq('match_id', matchId)
      .order('over_number', { ascending: true }).order('ball_number', { ascending: true })
      .then(({ data }) => { if (data) setBalls(data); setLoading(false); });
  }, [matchId]);

  return { balls, loading };
}
