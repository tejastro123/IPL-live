import { Link } from 'react-router-dom';
import { useLiveMatchesWithFallback } from '../hooks/useData';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { TeamBadge } from '../components/MatchCard';
import { usePointsTable, useNews } from '../hooks/useData';
import { Trophy, Radio, Calendar, ArrowRight, TrendingUp, Flame, Wifi } from 'lucide-react';

export default function HomePage() {
  const { matches, loading, usingLive } = useLiveMatchesWithFallback();
  const { entries, loading: ptsLoading } = usePointsTable();
  const { articles, loading: newsLoading } = useNews();

  if (loading) return <LoadingSpinner />;

  const liveMatchesList = matches.filter((m: any) => m.status === 'live');
  const upcomingMatches = matches.filter((m: any) => m.status === 'upcoming').slice(0, 3);
  const completedMatches = matches.filter((m: any) => m.status === 'completed').slice(0, 3);
  const featuredNews = articles.filter((a: any) => a.is_featured).slice(0, 2);
  const otherNews = articles.filter((a: any) => !a.is_featured).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ipl-navy via-ipl-dark to-ipl-surface">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ipl-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-ipl-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              {liveMatchesList.length > 0 ? (
                <span className="badge-live"><span className="live-dot mr-1.5" />LIVE NOW</span>
              ) : (
                <span className="badge-upcoming">Season Active</span>
              )}
              {liveMatchesList.length > 0 && (
                <span className="text-xs text-gray-400 ml-2">{liveMatchesList.length} match{liveMatchesList.length > 1 ? 'es' : ''} in progress</span>
              )}
              {usingLive && (
                <span className="flex items-center gap-1 text-xs text-green-400 ml-2">
                  <Wifi className="w-3 h-3" /> Cricbuzz
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              IPL <span className="text-ipl-gold">2026</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 leading-relaxed max-w-lg">
              The biggest cricket festival is here. Follow every ball, every six, every wicket across the 2026 Indian Premier League season.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/live" className="btn-gold flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Live Scores
              </Link>
              <Link to="/fixtures" className="btn-outline flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Full Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container space-y-12">
        {/* Live Matches */}
        {liveMatchesList.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2 mb-0">
                <span className="live-dot" />
                Live Matches
                {usingLive && <span className="text-xs text-green-400 font-normal ml-2 flex items-center gap-1"><Wifi className="w-3 h-3" />Cricbuzz</span>}
              </h2>
              <Link to="/live" className="text-sm text-ipl-gold hover:text-ipl-gold/80 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatchesList.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2 mb-0">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Matches
              </h2>
              <Link to="/fixtures" className="text-sm text-ipl-gold hover:text-ipl-gold/80 flex items-center gap-1 transition-colors">
                Full schedule <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingMatches.map((match: any) => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </section>
        )}

        {/* Recent Results */}
        {completedMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2 mb-0">
                <Trophy className="w-5 h-5 text-ipl-gold" />
                Recent Results
              </h2>
              <Link to="/fixtures" className="text-sm text-ipl-gold hover:text-ipl-gold/80 flex items-center gap-1 transition-colors">
                All results <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedMatches.map((match: any) => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Points Table Snapshot */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2 mb-0">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Points Table
              </h2>
              <Link to="/points-table" className="text-sm text-ipl-gold hover:text-ipl-gold/80 flex items-center gap-1 transition-colors">
                Full table <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {!ptsLoading && entries.length > 0 && (
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ipl-border text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left py-3 px-4">#</th>
                      <th className="text-left py-3 px-4">Team</th>
                      <th className="text-center py-3 px-2">M</th>
                      <th className="text-center py-3 px-2">W</th>
                      <th className="text-center py-3 px-2">L</th>
                      <th className="text-center py-3 px-2">Pts</th>
                      <th className="text-center py-3 px-2">NRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.slice(0, 5).map((entry: any) => (
                      <tr key={entry.id} className={`border-b border-ipl-border/30 hover:bg-white/[0.02] transition-colors ${entry.position <= 4 ? 'bg-green-500/[0.03]' : ''}`}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-400">{entry.position}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <TeamBadge shortName={entry.team?.short_name || ''} />
                            <span className="text-sm font-medium text-white">{entry.team?.short_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-gray-400">{entry.matches_played}</td>
                        <td className="py-3 px-2 text-center text-sm text-green-400 font-medium">{entry.won}</td>
                        <td className="py-3 px-2 text-center text-sm text-red-400">{entry.lost}</td>
                        <td className="py-3 px-2 text-center text-sm font-bold text-white">{entry.points}</td>
                        <td className="py-3 px-2 text-center text-sm text-gray-400">{entry.net_run_rate > 0 ? '+' : ''}{entry.net_run_rate.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 border-t border-ipl-border/30">
                  <p className="text-xs text-green-500/60">Top 4 qualify for playoffs</p>
                </div>
              </div>
            )}
          </section>

          {/* Latest News */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2 mb-0 text-xl">
                <Flame className="w-5 h-5 text-orange-400" />
                Latest News
              </h2>
              <Link to="/news" className="text-sm text-ipl-gold hover:text-ipl-gold/80 flex items-center gap-1 transition-colors">
                All news <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {!newsLoading && (
              <div className="space-y-3">
                {featuredNews.concat(otherNews).slice(0, 4).map((article: any) => (
                  <Link key={article.id} to={`/news/${article.slug}`} className="card-hover block p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-ipl-gold font-medium">{article.category.replace('-', ' ')}</span>
                        <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 leading-snug">{article.title}</h3>
                        <p className="text-xs text-gray-500 mt-1.5">{new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
