import { Link } from 'react-router-dom';
import { useTeams } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, MapPin } from 'lucide-react';

export default function TeamsPage() {
  const { teams, loading } = useTeams();
  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">IPL 2026 Teams</h1>
        <p className="text-gray-400 mt-2">All 10 franchises competing in the 2026 season</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {teams.map((team: any) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            className="card-hover group block"
          >
            <div className="p-5 text-center">
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: team.color_primary, color: team.color_secondary }}
                >
                  {team.short_name}
                </div>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-ipl-gold transition-colors">{team.name}</h3>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {team.city}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Trophy className="w-3 h-3" />
                  {team.titles_won} Title{team.titles_won !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
