import { useParams, Link } from 'react-router-dom';
import { useLiveScorecardWithFallback, useLiveCommentary, useBallByBall } from '../hooks/useData';
import { TeamBadge } from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, MapPin, Calendar, Radio, Award, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { LiveInnings } from '../services/cricketApi';

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { liveScorecard, localMatch, localInnings, loading, usingLive } = useLiveScorecardWithFallback(id || '');
  const { commentary } = useLiveCommentary(id || '');
  const { balls, loading: ballsLoading } = useBallByBall(id || '');
  const [momName, setMomName] = useState<string>('');

  useEffect(() => {
    if (localMatch?.man_of_the_match_id) {
      supabase.from('players').select('name').eq('id', localMatch.man_of_the_match_id).maybeSingle()
        .then(({ data }) => { if (data) setMomName(data.name); });
    }
  }, [localMatch?.man_of_the_match_id]);

  if (loading) return <LoadingSpinner />;
  if (!localMatch && !liveScorecard) return <div className="page-container text-center py-20 text-gray-500">Match not found</div>;

  const match = localMatch;
  const innings = localInnings;
  const isLive = match?.status === 'live' || liveScorecard?.status === 'live';
  const tossTeam = match?.home_team_id === match?.toss_winner_id ? match?.home_team : match?.away_team;
  const hasLiveScores = usingLive && liveScorecard;

  // Determine which scorecard data to show
  const liveScorecardInnings: LiveInnings[] = liveScorecard?.scorecard || [];
  const hasLiveScorecard = liveScorecardInnings.length > 0 && liveScorecardInnings.some(inn => inn.batsmen?.length > 0);

  // Use live commentary if available, otherwise local ball-by-ball
  const hasLiveCommentary = commentary.length > 0;

  return (
    <div>
      {/* Match Header */}
      <div className="bg-gradient-to-b from-ipl-surface to-ipl-dark border-b border-ipl-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/live" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Live Scores
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="text-center">
                <TeamBadge shortName={match?.home_team?.short_name || liveScorecard?.teamInfo?.[0]?.shortname || ''} large />
                <p className="mt-2 font-bold text-white text-sm">{match?.home_team?.short_name || liveScorecard?.teamInfo?.[0]?.shortname || ''}</p>
              </div>
              <div className="text-center px-4">
                {isLive ? (
                  <span className="badge-live text-sm"><span className="live-dot mr-1.5" />LIVE</span>
                ) : (
                  <span className="text-2xl font-bold text-gray-600">VS</span>
                )}
              </div>
              <div className="text-center">
                <TeamBadge shortName={match?.away_team?.short_name || liveScorecard?.teamInfo?.[1]?.shortname || ''} large />
                <p className="mt-2 font-bold text-white text-sm">{match?.away_team?.short_name || liveScorecard?.teamInfo?.[1]?.shortname || ''}</p>
              </div>
            </div>
            {hasLiveScores ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <Wifi className="w-3 h-3" /> Cricbuzz Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-500/10 border border-gray-500/20 px-2.5 py-1 rounded-full">
                <WifiOff className="w-3 h-3" /> Local Data
              </span>
            )}
          </div>

          {/* Score Summary from local data */}
          {innings.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {innings.map((inn: any) => (
                <div key={inn.id} className="card px-5 py-3">
                  <p className="text-xs text-gray-500">{inn.batting_team?.short_name} - {inn.innings_number === 1 ? '1st' : '2nd'} Innings</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {inn.total_runs}/{inn.wickets_lost}
                    <span className="text-sm text-gray-500 ml-2 font-normal">({inn.overs_bowled} ov)</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Live API Scores */}
          {hasLiveScores && liveScorecard?.score && liveScorecard.score.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-green-400 mb-2 flex items-center gap-1"><Wifi className="w-3 h-3" /> Cricbuzz Live Scores</p>
              <div className="flex flex-wrap gap-3">
                {liveScorecard.score.map((s: any, i: number) => (
                  <div key={i} className="bg-green-500/5 border border-green-500/20 rounded-lg px-4 py-2">
                    <p className="text-xs text-gray-400">{s.inning}</p>
                    <p className="text-lg font-bold text-white">{s.r}/{s.w} <span className="text-xs text-gray-500 font-normal">({s.o} ov)</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {match?.result_description && (
            <p className="mt-4 text-ipl-gold font-semibold">{match.result_description}</p>
          )}
          {hasLiveScores && liveScorecard?.result && (
            <p className="mt-2 text-ipl-gold font-semibold">{liveScorecard.result}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match?.venue || liveScorecard?.venue}, {match?.city}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(match?.date || liveScorecard?.date || '').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {match?.toss_winner_id && <span className="flex items-center gap-1">Toss: {tossTeam?.short_name} - {match.toss_decision === 'bat' ? 'Bat' : 'Field'} first</span>}
            {hasLiveScores && liveScorecard?.toss && <span className="flex items-center gap-1">Toss: {liveScorecard.toss}</span>}
            {momName && <span className="flex items-center gap-1"><Award className="w-3 h-3 text-ipl-gold" />MOM: {momName}</span>}
            {hasLiveScores && liveScorecard?.manOfMatch && <span className="flex items-center gap-1"><Award className="w-3 h-3 text-ipl-gold" />MOM: {liveScorecard.manOfMatch}</span>}
          </div>
        </div>
      </div>

      <div className="page-container space-y-8">
        {/* Live Scorecard from Cricbuzz */}
        {hasLiveScorecard && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-400" />
              Cricbuzz Live Scorecard
            </h2>
            {liveScorecardInnings.map((inn) => (
              <div key={inn.innings_id} className="mb-6">
                <h3 className="text-base font-bold text-white mb-3">
                  {inn.bat_team_short || inn.bat_team_name} Innings
                  <span className="ml-3 text-ipl-gold text-sm font-normal">
                    {inn.score}/{inn.wkts} ({inn.overs} ov)
                  </span>
                </h3>

                {/* Batting */}
                {inn.batsmen?.length > 0 && (
                  <div className="card overflow-hidden mb-4">
                    <div className="px-4 py-2 border-b border-ipl-border/50">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Batting</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-ipl-border/30 text-xs text-gray-500">
                            <th className="text-left py-2 px-4 min-w-[160px]">Batter</th>
                            <th className="text-center py-2 px-2 w-10">R</th>
                            <th className="text-center py-2 px-2 w-10">B</th>
                            <th className="text-center py-2 px-2 w-10">4s</th>
                            <th className="text-center py-2 px-2 w-10">6s</th>
                            <th className="text-center py-2 px-2 w-14">SR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inn.batsmen.map((b, i) => (
                            <tr key={i} className="border-b border-ipl-border/20 hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4">
                                <span className="font-medium text-white">{b.name}</span>
                                <span className="text-xs text-gray-500 ml-2">{b.dismissal && b.dismissal !== 'not out' ? b.dismissal : ''}</span>
                                {b.dismissal === 'not out' && <span className="text-xs text-ipl-gold ml-1">*</span>}
                              </td>
                              <td className="text-center py-2.5 px-2 font-bold text-white">{b.runs}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.balls}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.fours}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.sixes}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.strike_rate.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Bowling */}
                {inn.bowlers?.length > 0 && (
                  <div className="card overflow-hidden mb-4">
                    <div className="px-4 py-2 border-b border-ipl-border/50 flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bowling</h4>
                      <span className="text-xs text-gray-600">Extras: {inn.extras?.total || 0}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-ipl-border/30 text-xs text-gray-500">
                            <th className="text-left py-2 px-4 min-w-[140px]">Bowler</th>
                            <th className="text-center py-2 px-2 w-10">O</th>
                            <th className="text-center py-2 px-2 w-10">M</th>
                            <th className="text-center py-2 px-2 w-10">R</th>
                            <th className="text-center py-2 px-2 w-10">W</th>
                            <th className="text-center py-2 px-2 w-14">Econ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inn.bowlers.map((b, i) => (
                            <tr key={i} className="border-b border-ipl-border/20 hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4 font-medium text-white">{b.name}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.overs}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.maidens}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.runs}</td>
                              <td className="text-center py-2.5 px-2 font-bold text-white">{b.wickets}</td>
                              <td className="text-center py-2.5 px-2 text-gray-400">{b.economy.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Fall of Wickets */}
                {inn.fall_of_wickets?.length > 0 && (
                  <div className="card p-4 mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fall of Wickets</h4>
                    <div className="flex flex-wrap gap-2">
                      {inn.fall_of_wickets.map((f, i) => (
                        <span key={i} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">
                          {f.wicket_number}-{f.score} ({f.name}, {f.overs} ov)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Local Scorecards (fallback) */}
        {!hasLiveScorecard && innings.map((inn: any) => (
          <section key={inn.id}>
            <h2 className="text-lg font-bold text-white mb-4">
              {inn.batting_team?.short_name} Innings
              <span className="ml-3 text-ipl-gold text-base font-normal">
                {inn.total_runs}/{inn.wickets_lost} ({inn.overs_bowled} ov)
              </span>
            </h2>

            {/* Batting */}
            <div className="card overflow-hidden mb-4">
              <div className="px-4 py-2 border-b border-ipl-border/50">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Batting</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ipl-border/30 text-xs text-gray-500">
                      <th className="text-left py-2 px-4 min-w-[160px]">Batter</th>
                      <th className="text-center py-2 px-2 w-10">R</th>
                      <th className="text-center py-2 px-2 w-10">B</th>
                      <th className="text-center py-2 px-2 w-10">4s</th>
                      <th className="text-center py-2 px-2 w-10">6s</th>
                      <th className="text-center py-2 px-2 w-14">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inn.innings_batsmen?.map((b: any) => (
                      <tr key={b.id} className="border-b border-ipl-border/20 hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4">
                          <span className="font-medium text-white">{b.player_name}</span>
                          <span className="text-xs text-gray-500 ml-2">{b.dismissal !== 'not out' ? b.dismissal : ''}</span>
                          {b.dismissal === 'not out' && <span className="text-xs text-ipl-gold ml-1">*</span>}
                        </td>
                        <td className="text-center py-2.5 px-2 font-bold text-white">{b.runs_scored}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{b.balls_faced}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{b.fours}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{b.sixes}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{Number(b.strike_rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling */}
            <div className="card overflow-hidden mb-4">
              <div className="px-4 py-2 border-b border-ipl-border/50 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bowling</h3>
                <span className="text-xs text-gray-600">Extras: {inn.extras_total || 0}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ipl-border/30 text-xs text-gray-500">
                      <th className="text-left py-2 px-4 min-w-[140px]">Bowler</th>
                      <th className="text-center py-2 px-2 w-10">O</th>
                      <th className="text-center py-2 px-2 w-10">M</th>
                      <th className="text-center py-2 px-2 w-10">R</th>
                      <th className="text-center py-2 px-2 w-10">W</th>
                      <th className="text-center py-2 px-2 w-14">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inn.innings_bowlers?.map((b: any) => (
                      <tr key={b.id} className="border-b border-ipl-border/20 hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-medium text-white">{b.player_name}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{b.overs_bowled}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{b.maidens}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{b.runs_conceded}</td>
                        <td className="text-center py-2.5 px-2 font-bold text-white">{b.wickets_taken}</td>
                        <td className="text-center py-2.5 px-2 text-gray-400">{Number(b.economy).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))}

        {/* Key Stats (only from local data when no live scorecard) */}
        {!hasLiveScorecard && innings.length === 2 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Key Stats</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(() => {
                const inn1 = innings[0];
                const inn2 = innings[1];
                const totalFours1 = inn1.innings_batsmen?.reduce((s: number, b: any) => s + b.fours, 0) || 0;
                const totalSixes1 = inn1.innings_batsmen?.reduce((s: number, b: any) => s + b.sixes, 0) || 0;
                const totalFours2 = inn2.innings_batsmen?.reduce((s: number, b: any) => s + b.fours, 0) || 0;
                const totalSixes2 = inn2.innings_batsmen?.reduce((s: number, b: any) => s + b.sixes, 0) || 0;
                const topScorer1 = inn1.innings_batsmen?.reduce((best: any, b: any) => b.runs_scored > (best?.runs_scored || 0) ? b : best, null);
                const topScorer2 = inn2.innings_batsmen?.reduce((best: any, b: any) => b.runs_scored > (best?.runs_scored || 0) ? b : best, null);
                const topBowler1 = inn1.innings_bowlers?.reduce((best: any, b: any) => b.wickets_taken > (best?.wickets_taken || 0) ? b : best, null);
                const topBowler2 = inn2.innings_bowlers?.reduce((best: any, b: any) => b.wickets_taken > (best?.wickets_taken || 0) ? b : best, null);
                return (
                  <>
                    <div className="card p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Boundaries</p>
                      <p className="text-lg font-bold text-white">{totalFours1 + totalFours2} <span className="text-xs text-gray-500 font-normal">fours</span></p>
                      <p className="text-lg font-bold text-white">{totalSixes1 + totalSixes2} <span className="text-xs text-gray-500 font-normal">sixes</span></p>
                    </div>
                    <div className="card p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Top Scorers</p>
                      <p className="text-sm font-medium text-white">{topScorer1?.player_name}: {topScorer1?.runs_scored}</p>
                      <p className="text-sm font-medium text-white">{topScorer2?.player_name}: {topScorer2?.runs_scored}</p>
                    </div>
                    <div className="card p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Best Bowling</p>
                      <p className="text-sm font-medium text-white">{topBowler1?.player_name}: {topBowler1?.wickets_taken}/{topBowler1?.runs_conceded}</p>
                      <p className="text-sm font-medium text-white">{topBowler2?.player_name}: {topBowler2?.wickets_taken}/{topBowler2?.runs_conceded}</p>
                    </div>
                    <div className="card p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Runs</p>
                      <p className="text-lg font-bold text-white">{(inn1.total_runs + inn2.total_runs)} <span className="text-xs text-gray-500 font-normal">runs</span></p>
                      <p className="text-sm text-gray-400">{inn1.total_runs} + {inn2.total_runs}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </section>
        )}

        {/* Live Commentary from Cricbuzz */}
        {hasLiveCommentary && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400" />
              Ball-by-Ball Commentary
              <span className="text-xs text-green-400 font-normal flex items-center gap-1"><Wifi className="w-3 h-3" /> Cricbuzz</span>
            </h2>
            <div className="card overflow-hidden divide-y divide-ipl-border/20 max-h-[500px] overflow-y-auto">
              {commentary.map((c, i) => {
                const isWicket = c.text?.toLowerCase().includes('wicket') || c.text?.toLowerCase().includes('out');
                const isFour = c.text?.toLowerCase().includes('four') || c.text?.includes('FOUR');
                const isSix = c.text?.toLowerCase().includes('six') || c.text?.includes('SIX');
                return (
                  <div key={i} className="px-4 py-3 flex gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="w-12 flex-shrink-0 text-right">
                      <span className="text-xs font-mono font-bold text-ipl-gold">{c.over}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {isSix && <span className="text-xs font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">6</span>}
                        {isFour && <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">4</span>}
                        {isWicket && <span className="text-xs font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">W</span>}
                      </div>
                      <p className="text-sm text-gray-300">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Local Ball-by-Ball Commentary (fallback) */}
        {!hasLiveCommentary && !ballsLoading && balls.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400" />
              Ball-by-Ball Commentary
            </h2>
            <div className="card overflow-hidden divide-y divide-ipl-border/20">
              {balls.map((ball: any) => {
                const overBall = `${ball.over_number}.${ball.ball_number}`;
                return (
                  <div key={ball.id} className="px-4 py-3 flex gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="w-12 flex-shrink-0 text-right">
                      <span className="text-xs font-mono font-bold text-ipl-gold">{overBall}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {ball.is_six && <span className="text-xs font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">6</span>}
                        {ball.is_four && <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">4</span>}
                        {ball.is_wicket && <span className="text-xs font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">W</span>}
                        {ball.extras_type && <span className="text-xs text-yellow-400">{ball.extras_type}</span>}
                      </div>
                      <p className="text-sm text-gray-300">{ball.commentary_text}</p>
                    </div>
                    <div className="w-8 flex-shrink-0 text-right">
                      <span className={`text-sm font-bold ${ball.runs_scored > 0 ? 'text-white' : 'text-gray-600'}`}>
                        {ball.extras_runs > 0 ? ball.runs_scored + ball.extras_runs : ball.runs_scored}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
