import { useLiveMatchesWithFallback } from '../hooks/useData';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Radio, Clock, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

export default function LiveScoresPage() {
  const { matches, loading, usingLive } = useLiveMatchesWithFallback();

  if (loading) return <LoadingSpinner />;

  const live = matches.filter((m: any) => m.status === 'live');
  const upcoming = matches.filter((m: any) => m.status === 'upcoming');
  const completed = matches.filter((m: any) => m.status === 'completed');

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Radio className="w-7 h-7 text-red-500" />
            Live Scores
          </h1>
          {usingLive ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <Wifi className="w-3 h-3" /> Cricbuzz Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-500/10 border border-gray-500/20 px-2.5 py-1 rounded-full">
              <WifiOff className="w-3 h-3" /> Local Data
            </span>
          )}
        </div>
        <p className="text-gray-400 mt-2">Real-time match updates and scorecards</p>
      </div>

      {/* Live */}
      {live.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <span className="live-dot" />
            Live Now
            {usingLive && <span className="text-xs text-green-400 font-normal ml-1">Cricbuzz auto-refresh</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {live.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            Upcoming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((match: any) => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
            Completed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((match: any) => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No matches found</p>
        </div>
      )}
    </div>
  );
}
