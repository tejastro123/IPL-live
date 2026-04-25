import { useState, useEffect } from 'react';
import { useMatches, usePredictions, useTeams } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { TeamBadge } from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Target, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

export default function PredictionsPage() {
  const { user } = useAuth();
  const { matches, loading: matchesLoading } = useMatches();
  const { teams } = useTeams();
  const { predictions } = usePredictions();
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [userPredictions, setUserPredictions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      supabase.from('predictions').select('*').eq('user_id', user.id).then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p: any) => { map[p.match_id] = p.predicted_winner_id; });
          setUserPredictions(map);
        }
      });
    }
  }, [user]);

  if (matchesLoading) return <LoadingSpinner />;

  const upcomingMatches = matches.filter((m: any) => m.status === 'upcoming');

  const getCommunityPicks = (matchId: string) => {
    const matchPreds = predictions.filter((p: any) => p.match_id === matchId);
    const total = matchPreds.length;
    if (total === 0) return {};
    const counts: Record<string, number> = {};
    matchPreds.forEach((p: any) => {
      counts[p.predicted_winner_id] = (counts[p.predicted_winner_id] || 0) + 1;
    });
    const result: Record<string, number> = {};
    Object.entries(counts).forEach(([teamId, count]) => {
      result[teamId] = Math.round((count / total) * 100);
    });
    return result;
  };

  const handlePredict = async (matchId: string, winnerId: string) => {
    if (!user) return;
    setSubmitting(matchId);
    const { error } = await supabase.from('predictions').insert({
      user_id: user.id,
      match_id: matchId,
      predicted_winner_id: winnerId,
    });
    if (!error) {
      setUserPredictions((prev) => ({ ...prev, [matchId]: winnerId }));
    }
    setSubmitting(null);
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-7 h-7 text-ipl-gold" />
          Match Predictions
        </h1>
        <p className="text-gray-400 mt-2">Predict match winners and earn points</p>
      </div>

      {/* How it works */}
      <div className="card p-5 mb-8">
        <h2 className="text-sm font-semibold text-white mb-3">How Predictions Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Target className="w-5 h-5 text-ipl-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Pick a Winner</p>
              <p className="text-gray-500 text-xs mt-0.5">Select who you think will win each match</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Earn Points</p>
              <p className="text-gray-500 text-xs mt-0.5">10 points for each correct prediction</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Climb the Leaderboard</p>
              <p className="text-gray-500 text-xs mt-0.5">Compete with other fans for the top spot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="space-y-4">
        {upcomingMatches.length === 0 && (
          <div className="text-center py-12 text-gray-500">No upcoming matches to predict</div>
        )}
        {upcomingMatches.map((match: any) => {
          const communityPicks = getCommunityPicks(match.id);
          const userPick = userPredictions[match.id];
          const homePct = communityPicks[match.home_team_id] || 50;
          const awayPct = communityPicks[match.away_team_id] || 50;

          return (
            <div key={match.id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500">Match {match.match_number}</span>
                <span className="badge-upcoming">Upcoming</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 text-center">
                  <TeamBadge shortName={match.home_team?.short_name || ''} large />
                  <p className="mt-2 font-semibold text-white text-sm">{match.home_team?.short_name}</p>
                </div>
                <span className="text-gray-600 font-bold text-lg">VS</span>
                <div className="flex-1 text-center">
                  <TeamBadge shortName={match.away_team?.short_name || ''} large />
                  <p className="mt-2 font-semibold text-white text-sm">{match.away_team?.short_name}</p>
                </div>
              </div>

              {/* Community Consensus */}
              {predictions.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">Community Picks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-8 text-right">{homePct}%</span>
                    <div className="flex-1 h-2 bg-ipl-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ipl-gold/60 rounded-full transition-all"
                        style={{ width: `${homePct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{awayPct}%</span>
                  </div>
                </div>
              )}

              {/* Prediction Buttons */}
              {user ? (
                userPick ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-center">
                    <p className="text-sm text-green-400 font-medium">
                      You predicted: {teams.find((t: any) => t.id === userPick)?.short_name || 'Unknown'}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePredict(match.id, match.home_team_id)}
                      disabled={submitting === match.id}
                      className="flex-1 btn-outline text-sm py-2.5 hover:bg-ipl-gold/10 hover:border-ipl-gold/30 hover:text-ipl-gold"
                    >
                      {match.home_team?.short_name} Wins
                    </button>
                    <button
                      onClick={() => handlePredict(match.id, match.away_team_id)}
                      disabled={submitting === match.id}
                      className="flex-1 btn-outline text-sm py-2.5 hover:bg-ipl-gold/10 hover:border-ipl-gold/30 hover:text-ipl-gold"
                    >
                      {match.away_team?.short_name} Wins
                    </button>
                  </div>
                )
              ) : (
                <p className="text-center text-sm text-gray-500">Sign in to make predictions</p>
              )}

              <div className="mt-3 text-xs text-gray-600 text-center">
                {match.venue} &middot; {new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
