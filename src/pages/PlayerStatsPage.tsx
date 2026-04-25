import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { TeamBadge } from '../components/MatchCard';
import { BarChart3, Search } from 'lucide-react';

interface PlayerWithTeam {
  id: string;
  name: string;
  role: string;
  nationality: string;
  batting_style: string;
  bowling_style: string;
  jersey_number: number | null;
  team_id: string;
  team_name: string;
  team_short: string;
  team_color: string;
}

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerWithTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'batting' | 'bowling'>('batting');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('players')
      .select('*, team:teams(name, short_name, color_primary)')
      .order('name')
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map((p: any) => ({
            ...p,
            team_name: p.team?.name || '',
            team_short: p.team?.short_name || '',
            team_color: p.team?.color_primary || '#666',
          }));
          setPlayers(mapped as PlayerWithTeam[]);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team_short.toLowerCase().includes(search.toLowerCase()) ||
    p.nationality.toLowerCase().includes(search.toLowerCase())
  );

  const batsmen = filtered.filter(
    (p) => p.role === 'batsman' || p.role === 'wicket-keeper' || p.role === 'all-rounder'
  );
  const bowlers = filtered.filter(
    (p) => p.role === 'bowler' || p.role === 'all-rounder'
  );

  const displayList = tab === 'batting' ? batsmen : bowlers;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-green-400" />
          Player Statistics
        </h1>
        <p className="text-gray-400 mt-2">Individual performance metrics for IPL 2026</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players, teams, countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-1 bg-ipl-surface rounded-lg p-1 border border-ipl-border">
          <button
            onClick={() => setTab('batting')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === 'batting' ? 'bg-ipl-gold/15 text-ipl-gold' : 'text-gray-500 hover:text-white'
            }`}
          >
            Batting
          </button>
          <button
            onClick={() => setTab('bowling')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === 'bowling' ? 'bg-ipl-gold/15 text-ipl-gold' : 'text-gray-500 hover:text-white'
            }`}
          >
            Bowling
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ipl-border text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Player</th>
                <th className="text-left py-3 px-4">Team</th>
                <th className="text-left py-3 px-4">Role</th>
                {tab === 'batting' ? (
                  <>
                    <th className="text-left py-3 px-4">Batting Style</th>
                    <th className="text-left py-3 px-4">Nationality</th>
                  </>
                ) : (
                  <>
                    <th className="text-left py-3 px-4">Bowling Style</th>
                    <th className="text-left py-3 px-4">Nationality</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayList.map((player, idx) => (
                <tr key={player.id} className="border-b border-ipl-border/20 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-gray-600 text-xs">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: player.team_color + '33', color: player.team_color }}
                      >
                        {player.jersey_number || '#'}
                      </div>
                      <span className="font-medium text-white">{player.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <TeamBadge shortName={player.team_short} />
                      <span className="text-gray-400">{player.team_short}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      player.role === 'all-rounder' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      player.role === 'wicket-keeper' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      player.role === 'bowler' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {player.role}
                    </span>
                  </td>
                  {tab === 'batting' ? (
                    <td className="py-3 px-4 text-gray-400">{player.batting_style}</td>
                  ) : (
                    <td className="py-3 px-4 text-gray-400">{player.bowling_style || 'N/A'}</td>
                  )}
                  <td className="py-3 px-4 text-gray-400">{player.nationality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayList.length === 0 && (
          <div className="text-center py-12 text-gray-500">No players found</div>
        )}
      </div>
    </div>
  );
}
