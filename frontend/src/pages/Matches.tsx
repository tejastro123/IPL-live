import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

interface Match {
  id: number
  api_match_id: string
  match_name: string
  match_number: number
  date: string
  venue: string
  status: string
  match_type: string
  team1: { id: string; name: string; short: string }
  team2: { id: string; name: string; short: string }
  team1_score: string
  team1_wickets: number
  team1_overs: number
  team2_score: string
  team2_wickets: number
  team2_overs: number
  result: string
  winning_team: string
}

function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const fetchMatches = async () => {
    const res = await fetch('/api/matches')
    const data = await res.json()
    setMatches(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetch('/api/sync', { method: 'POST' })
    await fetchMatches()
    setRefreshing(false)
  }

  const filtered = matches.filter(m => {
    if (filter === 'all') return true
    return m.status === filter.toUpperCase()
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="loading">Loading matches...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h2>🏏 IPL Matches</h2>
        <button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? '🔄 Syncing...' : '🔄 Sync Live'}
        </button>
      </div>

      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All ({matches.length})</button>
        <button className={filter === 'live' ? 'active live' : ''} onClick={() => setFilter('live')}>🔴 Live ({matches.filter(m => m.status === 'LIVE').length})</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>✅ Completed ({matches.filter(m => m.status === 'COMPLETED').length})</button>
        <button className={filter === 'scheduled' ? 'active' : ''} onClick={() => setFilter('scheduled')}>📅 Upcoming ({matches.filter(m => m.status === 'SCHEDULED').length})</button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No matches found.</p>
          <button onClick={handleRefresh}>Sync Matches</button>
        </div>
      ) : (
        <div className="matches-grid">
          {filtered.map(m => (
            <Link key={m.id} to={`/match/${m.api_match_id}`} className={`match-card ${m.status.toLowerCase()}`}>
              {m.status === 'LIVE' && <div className="live-badge"><span className="pulse"></span> LIVE</div>}
              
              <div className="match-meta">
                <span className="match-type">{m.match_type}</span>
                <span className="match-date">{formatDate(m.date)}</span>
              </div>
              
              <div className="match-teams">
                <div className="team">
                  <span className="team-name">{m.team1.name}</span>
                  {m.team1_score && <span className="team-score">{m.team1_score}</span>}
                </div>
                <div className="vs">vs</div>
                <div className="team">
                  <span className="team-name">{m.team2.name}</span>
                  {m.team2_score && <span className="team-score">{m.team2_score}</span>}
                </div>
              </div>
              
              <div className="match-footer">
                <span className="venue">📍 {m.venue}</span>
                {m.result && <span className="result">{m.result}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Matches