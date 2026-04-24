import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchJson,
  formatDate,
  inferMatchState,
  MatchRecord,
  OverviewResponse,
} from '../lib/cricket'

function Matches() {
  const [matches, setMatches] = useState<MatchRecord[]>([])
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'completed' | 'upcoming'>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  const loadMatches = async () => {
    const [matchesData, overviewData] = await Promise.all([
      fetchJson<MatchRecord[]>('/api/matches').catch(() => []),
      fetchJson<OverviewResponse>('/api/overview').catch(() => null),
    ])

    return { matchesData, overviewData }
  }

  useEffect(() => {
    let active = true

    loadMatches()
      .then(({ matchesData, overviewData }) => {
        if (!active) return
        setMatches(matchesData)
        setOverview(overviewData)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/sync', { method: 'POST' })
      const payload = await response.json().catch(() => ({}))
      setSyncMessage(payload.message ?? payload.error ?? 'Sync finished')
      const { matchesData, overviewData } = await loadMatches()
      setMatches(matchesData)
      setOverview(overviewData)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredTrackedMatches = matches.filter((match) => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return match.status === 'SCHEDULED'
    return match.status.toLowerCase() === filter
  })

  const filteredBoardMatches = (overview?.matches ?? []).filter((match) => {
    if (filter === 'all') return true
    return inferMatchState(match.status) === filter
  })

  if (loading) return <div className="loading">Loading matches...</div>

  return (
    <div className="page-stack">
      <div className="page-banner">
        <div>
          <span className="eyebrow">Season board</span>
          <h1>IPL match center</h1>
          <p>Scraped season fixtures from `live-cricket-score-api`, plus tracked scorecards from your FastAPI database.</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="primary-cta">
          {refreshing ? 'Syncing tracked matches...' : 'Sync tracked matches'}
        </button>
      </div>

      <div className="filter-row">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'live' ? 'active live' : ''} onClick={() => setFilter('live')}>Live</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
        <button className={filter === 'upcoming' ? 'active' : ''} onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>

      {syncMessage && <div className="notice-banner">{syncMessage}</div>}

      <section className="glass-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Scraped season overview</span>
            <h2>Fixture board</h2>
          </div>
          <p>{overview?.series?.title ?? 'IPL season feed unavailable'}</p>
        </div>

        {filteredBoardMatches.length > 0 ? (
          <div className="fixture-list dense">
            {filteredBoardMatches.map((match) => (
              <article key={match.summary} className="fixture-card">
                <div className="fixture-line">
                  <strong>{match.team1}</strong>
                  <span>vs</span>
                  <strong>{match.team2}</strong>
                </div>
                <p>{match.label}</p>
                <p>{match.venue}</p>
                <span className={`status-pill ${inferMatchState(match.status)}`}>{match.status}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <p>No scraped fixtures for this filter.</p>
          </div>
        )}
      </section>

      <section className="glass-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tracked scorecards</span>
            <h2>Database-backed match details</h2>
          </div>
          <p>{filteredTrackedMatches.length} available</p>
        </div>

        {filteredTrackedMatches.length > 0 ? (
          <div className="tracked-match-grid">
            {filteredTrackedMatches.map((match) => (
              <Link key={match.id} to={`/match/${match.api_match_id}`} className={`tracked-match-card ${match.status.toLowerCase()}`}>
                <div className="tracked-match-meta">
                  <span className={`status-pill ${match.status === 'LIVE' ? 'live' : match.status === 'COMPLETED' ? 'completed' : 'upcoming'}`}>
                    {match.status}
                  </span>
                  <span>{formatDate(match.date, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <strong>{match.match_name}</strong>
                <div className="score-line">
                  <div>
                    <span>{match.team1.short}</span>
                    <strong>{match.team1_score || '-'}</strong>
                  </div>
                  <div>
                    <span>{match.team2.short}</span>
                    <strong>{match.team2_score || '-'}</strong>
                  </div>
                </div>
                <p>{match.result || match.venue}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tracked scorecards yet. Sync from the backend to populate detailed match pages.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Matches
