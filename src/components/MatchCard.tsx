import { Link } from 'react-router-dom';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

const teamColors: Record<string, { primary: string; secondary: string }> = {
  CSK: { primary: '#FCCA06', secondary: '#1C1C1C' },
  MI: { primary: '#004BA0', secondary: '#D4A843' },
  RCB: { primary: '#D4213D', secondary: '#000000' },
  KKR: { primary: '#3A225D', secondary: '#B3A34A' },
  DC: { primary: '#004C93', secondary: '#EF1C25' },
  PBKS: { primary: '#DD1F2D', secondary: '#EDD59E' },
  RR: { primary: '#EA1A85', secondary: '#1C1C7E' },
  SRH: { primary: '#F26522', secondary: '#FCEA09' },
  LSG: { primary: '#A72056', secondary: '#1D4D2C' },
  GT: { primary: '#1B2133', secondary: '#F9C8D5' },
};

function TeamBadge({ shortName, large }: { shortName: string; large?: boolean }) {
  const colors = teamColors[shortName] || { primary: '#666', secondary: '#fff' };
  const size = large ? 'w-14 h-14' : 'w-10 h-10';
  const textSize = large ? 'text-sm' : 'text-xs';
  return (
    <div
      className={`${size} rounded-xl flex items-center justify-center font-bold ${textSize} shadow-md`}
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      {shortName}
    </div>
  );
}

export { TeamBadge };

export default function MatchCard({ match, compact }: MatchCardProps) {
  const homeTeam = match.home_team;
  const awayTeam = match.away_team;
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const m = match as any;

  // Get scores from local innings data
  const innings = m.match_innings || [];
  const homeInnings = innings.find((i: any) => i.batting_team_id === match.home_team_id);
  const awayInnings = innings.find((i: any) => i.batting_team_id === match.away_team_id);

  // Get scores from Cricbuzz live data
  const liveScoreMap: Record<string, { runs: number; wickets: number; overs: number }> = m._liveScoreMap || {};
  const homeLiveScore = liveScoreMap[homeTeam?.short_name || ''];
  const awayLiveScore = liveScoreMap[awayTeam?.short_name || ''];

  // Use live scores if available, otherwise fall back to local
  const homeRuns = homeLiveScore?.runs ?? homeInnings?.total_runs;
  const homeWickets = homeLiveScore?.wickets ?? homeInnings?.wickets_lost;
  const homeOvers = homeLiveScore?.overs ?? homeInnings?.overs_bowled;
  const awayRuns = awayLiveScore?.runs ?? awayInnings?.total_runs;
  const awayWickets = awayLiveScore?.wickets ?? awayInnings?.wickets_lost;
  const awayOvers = awayLiveScore?.overs ?? awayInnings?.overs_bowled;

  const hasHomeScore = homeRuns !== undefined && homeRuns !== null;
  const hasAwayScore = awayRuns !== undefined && awayRuns !== null;
  const hasScores = hasHomeScore || hasAwayScore;

  return (
    <Link
      to={`/match/${match.id}`}
      className={`card-hover block ${isLive ? 'border-red-500/30 shadow-red-500/5 shadow-lg' : ''}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 font-medium">Match {match.match_number}</span>
          {isLive && (
            <span className="badge-live">
              <span className="live-dot mr-1.5" />
              LIVE
            </span>
          )}
          {isCompleted && <span className="badge-completed">Completed</span>}
          {!isLive && !isCompleted && <span className="badge-upcoming">Upcoming</span>}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <TeamBadge shortName={homeTeam?.short_name || ''} large={!compact} />
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm sm:text-base truncate">{homeTeam?.short_name}</p>
              {!compact && <p className="text-xs text-gray-500 truncate">{homeTeam?.name}</p>}
            </div>
          </div>

          <div className="text-center px-2">
            {isLive ? (
              <span className="text-ipl-gold font-bold text-lg">VS</span>
            ) : (
              <span className="text-gray-600 font-bold text-lg">VS</span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            <div className="min-w-0 text-right">
              <p className="font-semibold text-white text-sm sm:text-base truncate">{awayTeam?.short_name}</p>
              {!compact && <p className="text-xs text-gray-500 truncate">{awayTeam?.name}</p>}
            </div>
            <TeamBadge shortName={awayTeam?.short_name || ''} large={!compact} />
          </div>
        </div>

        {(isLive || isCompleted) && hasScores && (
          <div className="mt-4 pt-3 border-t border-ipl-border/50">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-400">{homeTeam?.short_name}</span>
                {hasHomeScore && (
                  <span className="ml-2 font-bold text-white">
                    {homeRuns}/{homeWickets}
                    <span className="text-xs text-gray-500 ml-1">({homeOvers})</span>
                  </span>
                )}
              </div>
              <div>
                <span className="text-gray-400">{awayTeam?.short_name}</span>
                {hasAwayScore && (
                  <span className="ml-2 font-bold text-white">
                    {awayRuns}/{awayWickets}
                    <span className="text-xs text-gray-500 ml-1">({awayOvers})</span>
                  </span>
                )}
              </div>
            </div>
            {isCompleted && match.result_description && (
              <p className="text-xs text-ipl-gold mt-2 font-medium">{match.result_description}</p>
            )}
            {isLive && m.live_status && (
              <p className="text-xs text-green-400 mt-2 font-medium">{m.live_status}</p>
            )}
          </div>
        )}

        {!compact && (
          <div className="mt-3 pt-3 border-t border-ipl-border/30 flex items-center justify-between text-xs text-gray-500">
            <span>{match.venue}</span>
            <span>{new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
