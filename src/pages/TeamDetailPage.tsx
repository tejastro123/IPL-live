import { useParams, Link } from 'react-router-dom';
import { useTeam, usePlayers, useMatches } from '../hooks/useData';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, MapPin, User, ArrowLeft } from 'lucide-react';

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { team, loading: teamLoading } = useTeam(id || '');
  const { players, loading: playersLoading } = usePlayers(id);
  const { matches } = useMatches();

  if (teamLoading) return <LoadingSpinner />;

  const teamMatches = matches.filter(
    (m: any) => m.home_team_id === id || m.away_team_id === id
  );
  const completed = teamMatches.filter((m: any) => m.status === 'completed').slice(0, 3);
  const upcoming = teamMatches.filter((m: any) => m.status === 'upcoming').slice(0, 3);

  const roleGroups = {
    batsman: players.filter((p: any) => p.role === 'batsman'),
    bowler: players.filter((p: any) => p.role === 'bowler'),
    'all-rounder': players.filter((p: any) => p.role === 'all-rounder'),
    'wicket-keeper': players.filter((p: any) => p.role === 'wicket-keeper'),
  };

  const roleLabels: Record<string, string> = {
    batsman: 'Batsmen',
    bowler: 'Bowlers',
    'all-rounder': 'All-Rounders',
    'wicket-keeper': 'Wicket-Keepers',
  };

  return (
    <div>
      {/* Team Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${team?.color_primary}22 0%, ${team?.color_primary}08 50%, transparent 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/teams" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Teams
          </Link>
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl"
              style={{ backgroundColor: team?.color_primary, color: team?.color_secondary }}
            >
              {team?.short_name}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{team?.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{team?.city}</span>
                <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4" />{team?.titles_won} Titles</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />Captain: {(team as any)?.captain?.name || 'TBD'}</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />Coach: {team?.coach_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container space-y-10">
        {/* Squad */}
        <section>
          <h2 className="section-title">Squad</h2>
          {playersLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-6">
              {Object.entries(roleGroups).map(([role, groupPlayers]) => {
                if (groupPlayers.length === 0) return null;
                return (
                  <div key={role}>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{roleLabels[role]}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {groupPlayers.map((player: any) => (
                        <div key={player.id} className="card-hover p-4 flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: team?.color_primary + '33', color: team?.color_primary }}
                          >
                            {player.jersey_number || '#'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{player.name}</p>
                            <p className="text-xs text-gray-500">{player.nationality} &middot; {player.batting_style}</p>
                            {player.bowling_style && <p className="text-xs text-gray-600">{player.bowling_style}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Results */}
        {completed.length > 0 && (
          <section>
            <h2 className="section-title">Recent Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completed.map((match: any) => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="section-title">Upcoming Fixtures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcoming.map((match: any) => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
