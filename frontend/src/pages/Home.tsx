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

interface LiveMatch {
  api_match_id: string
  match_name: string
  date: string
  venue: string
  status: string
  team1: { id: string; name: string; short: string }
  team2: { id: string; name: string; short: string }
  team1_score: string
  team2_score: string
  result: string
}

function Home() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data.slice(0, 5) : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <div className="hero">
        <h1>🏏 IPL 2026</h1>
        <p>Indian Premier League - Live Scores, Stats & More</p>
      </div>

      <div className="links-grid">
        <Link to="/matches" className="link-card">
          <span className="icon">📅</span>
          <span className="title">Matches</span>
          <span className="desc">All IPL matches - Live, Upcoming & Completed</span>
        </Link>
        <Link to="/standings" className="link-card">
          <span className="icon">📊</span>
          <span className="title">Points Table</span>
          <span className="desc">Team standings & rankings</span>
        </Link>
        <Link to="/teams" className="link-card">
          <span className="icon">🏆</span>
          <span className="title">Teams</span>
          <span className="desc">All 10 IPL teams & players</span>
        </Link>
        <Link to="/players" className="link-card">
          <span className="icon">👥</span>
          <span className="title">Players</span>
          <span className="desc">All player profiles</span>
        </Link>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Results</h2>
          <Link to="/matches" className="view-all">View All →</Link>
        </div>
        {matches.length > 0 ? (
          <div className="results-list">
            {matches.map(m => (
              <Link key={m.api_match_id} to={`/match/${m.api_match_id}`} className="result-card">
                <div className="result-date">{formatDate(m.date)}</div>
                <div className="result-teams">
                  <span className="team">{m.team1.name}</span>
                  <span className="vs">vs</span>
                  <span className="team">{m.team2.name}</span>
                </div>
                <div className="result-outcome">{m.result}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty">No matches yet. Click Refresh to sync.</p>
        )}
      </div>
    </div>
  )
}

export default Home