import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchJson,
  formatDate,
  getTeamMeta,
  inferMatchState,
  MatchRecord,
  OverviewMatch,
  OverviewResponse,
  pointsTableToRows,
  SiteStatus,
} from '../lib/cricket'

function Home() {
  const [matches, setMatches] = useState<MatchRecord[]>([])
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [status, setStatus] = useState<SiteStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadHome() {
      try {
        const [overviewData, matchesData, statusData] = await Promise.all([
          fetchJson<OverviewResponse>('/api/overview').catch(() => null),
          fetchJson<MatchRecord[]>('/api/matches').catch(() => []),
          fetchJson<SiteStatus>('/api/status').catch(() => null),
        ])

        if (!active) return
        setOverview(overviewData)
        setMatches(matchesData)
        setStatus(statusData)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadHome()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <div className="loading">Loading season view...</div>

  const seasonTitle = overview?.series?.title ?? 'IPL 2026'
  const liveMatch = matches.find((match) => match.status === 'LIVE') ?? null
  const recentResults = matches.filter((match) => match.status === 'COMPLETED').slice(0, 3)
  const fixtures = (overview?.matches ?? []).filter((match) => inferMatchState(match.status) === 'upcoming').slice(0, 4)
  const pointsPreview = pointsTableToRows(overview).slice(0, 4)
  const spotlight: OverviewMatch | null =
    liveMatch
      ? {
          summary: liveMatch.match_name,
          label: liveMatch.match_type,
          venue: liveMatch.venue,
          team1: liveMatch.team1.short,
          team2: liveMatch.team2.short,
          status: liveMatch.result || liveMatch.status,
        }
      : fixtures[0] ?? null

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">IPL control room</span>
          <h1>{seasonTitle}</h1>
          <p>
            Live schedule coverage, standings fallback, and tracked scorecards now draw from the
            `live-cricket-score-api` folder instead of leaving it unused beside the website.
          </p>

          {status?.scraper_info && !status.scraper_info.available && (
            <div className="subtle-warning">
              Season scraper unavailable. Local tracked data is still online.
            </div>
          )}

          <div className="metric-row">
            <div className="metric-card">
              <strong>{status?.live_matches ?? 0}</strong>
              <span>Tracked live matches</span>
            </div>
            <div className="metric-card">
              <strong>{overview?.matches?.length ?? 0}</strong>
              <span>Season fixtures detected</span>
            </div>
            <div className="metric-card">
              <strong>{overview?.points_table?.length ?? 0}</strong>
              <span>Standings rows scraped</span>
            </div>
          </div>
        </div>

        <div className="spotlight-card">
          <div className="spotlight-header">
            <span className={`status-pill ${liveMatch ? 'live' : 'upcoming'}`}>
              {liveMatch ? 'Live spotlight' : 'Next fixture'}
            </span>
            {spotlight && <span>{spotlight.label}</span>}
          </div>

          {spotlight ? (
            <>
              <div className="versus-lockup">
                <div className="team-emblem" style={{ background: getTeamMeta(spotlight.team1).color }}>
                  {spotlight.team1}
                </div>
                <span className="versus-separator">vs</span>
                <div className="team-emblem" style={{ background: getTeamMeta(spotlight.team2).color }}>
                  {spotlight.team2}
                </div>
              </div>
              <h2>{spotlight.summary}</h2>
              <p>{spotlight.venue}</p>
              <p className="spotlight-status">{spotlight.status}</p>
              {liveMatch && (
                <Link to={`/match/${liveMatch.api_match_id}`} className="primary-cta">
                  Open tracked scorecard
                </Link>
              )}
            </>
          ) : (
            <div className="empty-state compact">
              <p>No season fixtures available right now.</p>
            </div>
          )}
        </div>
      </section>

      <section className="content-grid">
        <div className="glass-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Schedule board</span>
              <h2>Upcoming fixtures</h2>
            </div>
            <Link to="/matches" className="text-link">Full board</Link>
          </div>

          <div className="fixture-list">
            {fixtures.length > 0 ? fixtures.map((fixture) => (
              <article key={fixture.summary} className="fixture-card">
                <div className="fixture-line">
                  <strong>{fixture.team1}</strong>
                  <span>vs</span>
                  <strong>{fixture.team2}</strong>
                </div>
                <p>{fixture.label}</p>
                <p>{fixture.venue}</p>
                <span className="status-pill upcoming">{fixture.status}</span>
              </article>
            )) : (
              <div className="empty-state compact">
                <p>No upcoming fixtures from the season feed.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Table watch</span>
              <h2>Top four</h2>
            </div>
            <Link to="/standings" className="text-link">Standings</Link>
          </div>

          <div className="standings-preview">
            {pointsPreview.length > 0 ? pointsPreview.map((team, index) => (
              <div key={team.team_id} className="table-preview-row">
                <span className="rank-badge">{index + 1}</span>
                <div>
                  <strong>{team.team_short}</strong>
                  <p>{team.team_name}</p>
                </div>
                <div className="table-preview-metrics">
                  <span>{team.points} pts</span>
                  <small>NRR {team.net_run_rate}</small>
                </div>
              </div>
            )) : (
              <div className="empty-state compact">
                <p>Standings will appear here when the scraper responds.</p>
              </div>
            )}
          </div>

          {status?.scraper_info?.season && (
            <p className="subtle-note">Fallback season source: {status.scraper_info.season}</p>
          )}
        </div>
      </section>

      <section className="glass-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tracked results</span>
            <h2>Recent completed matches</h2>
          </div>
          <Link to="/matches" className="text-link">All tracked matches</Link>
        </div>

        {recentResults.length > 0 ? (
          <div className="result-grid">
            {recentResults.map((match) => (
              <Link key={match.api_match_id} to={`/match/${match.api_match_id}`} className="result-panel">
                <span className="result-date">{formatDate(match.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <strong>{match.team1.short} vs {match.team2.short}</strong>
                <p>{match.result || 'Result pending'}</p>
                <span>{match.venue}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tracked results yet. Use the admin dashboard to sync match scorecards.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
