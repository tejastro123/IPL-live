import { useState } from 'react';
import { useLiveMatchesWithFallback } from '../hooks/useData';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Filter, Wifi, WifiOff } from 'lucide-react';

export default function FixturesPage() {
  const { matches, loading, usingLive } = useLiveMatchesWithFallback();
  const [filter, setFilter] = useState<string>('all');

  if (loading) return <LoadingSpinner />;

  const filtered = filter === 'all' ? matches : matches.filter((m: any) => m.status === filter);

  const grouped = filtered.reduce((acc: any, match: any) => {
    const month = new Date(match.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(match);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-400" />
            Fixtures & Schedule
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            Complete IPL 2026 tournament calendar
            {usingLive ? (
              <span className="flex items-center gap-1 text-xs text-green-400"><Wifi className="w-3 h-3" /> Cricbuzz</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-gray-500"><WifiOff className="w-3 h-3" /> Local Data</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          {['all', 'upcoming', 'live', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-ipl-gold/15 text-ipl-gold border border-ipl-gold/30'
                  : 'text-gray-500 hover:text-white border border-transparent hover:border-ipl-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([month, monthMatches]: [string, any]) => (
        <section key={month} className="mb-10">
          <h2 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-wider">{month}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthMatches.map((match: any) => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No matches found for this filter</p>
        </div>
      )}
    </div>
  );
}
