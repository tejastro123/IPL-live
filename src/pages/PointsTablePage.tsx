import { usePointsTable } from '../hooks/useData';
import { TeamBadge } from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Table2 } from 'lucide-react';

export default function PointsTablePage() {
  const { entries, loading } = usePointsTable();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Table2 className="w-7 h-7 text-ipl-gold" />
          Points Table
        </h1>
        <p className="text-gray-400 mt-2">IPL 2026 standings and team rankings</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ipl-border text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-4 px-4 w-10">#</th>
                <th className="text-left py-4 px-4">Team</th>
                <th className="text-center py-4 px-3 w-10">M</th>
                <th className="text-center py-4 px-3 w-10">W</th>
                <th className="text-center py-4 px-3 w-10">L</th>
                <th className="text-center py-4 px-3 w-10">T</th>
                <th className="text-center py-4 px-3 w-10">NR</th>
                <th className="text-center py-4 px-3 w-12">Pts</th>
                <th className="text-center py-4 px-3 w-16">NRR</th>
                <th className="text-center py-4 px-4 w-32">Form</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any) => {
                const isQualified = entry.position <= 4;
                const form = entry.recent_form ? entry.recent_form.split(',') : [];
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-ipl-border/20 hover:bg-white/[0.02] transition-colors ${
                      isQualified ? 'bg-green-500/[0.03]' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className={`text-sm font-bold ${isQualified ? 'text-green-400' : 'text-gray-500'}`}>
                        {entry.position}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link to={`/teams/${entry.team_id}`} className="flex items-center gap-3 group">
                        <TeamBadge shortName={entry.team?.short_name || ''} />
                        <div>
                          <p className="font-semibold text-white text-sm group-hover:text-ipl-gold transition-colors">
                            {entry.team?.short_name}
                          </p>
                          <p className="text-xs text-gray-600">{entry.team?.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="text-center py-4 px-3 text-sm text-gray-400">{entry.matches_played}</td>
                    <td className="text-center py-4 px-3 text-sm text-green-400 font-medium">{entry.won}</td>
                    <td className="text-center py-4 px-3 text-sm text-red-400">{entry.lost}</td>
                    <td className="text-center py-4 px-3 text-sm text-gray-400">{entry.tied}</td>
                    <td className="text-center py-4 px-3 text-sm text-gray-400">{entry.no_result}</td>
                    <td className="text-center py-4 px-3 text-sm font-bold text-white">{entry.points}</td>
                    <td className="text-center py-4 px-3 text-sm text-gray-400">
                      {entry.net_run_rate > 0 ? '+' : ''}{Number(entry.net_run_rate).toFixed(3)}
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {form.map((result: string, i: number) => (
                          <span
                            key={i}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                              result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ipl-border/30 flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/30" />
          <span className="text-xs text-gray-500">Top 4 teams qualify for playoffs</span>
        </div>
      </div>
    </div>
  );
}
