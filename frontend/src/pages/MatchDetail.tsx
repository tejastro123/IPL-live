import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

interface MatchDetail {
  id: number
  api_match_id: string
  match_name: string
  date: string
  venue: string
  status: string
  team1: { id: string; name: string; short: string; score: string; wickets: number; overs: number }
  team2: { id: string; name: string; short: string; score: string; wickets: number; overs: number }
  result: string
  winning_team: string
  scorecards: Array<{ team_name: string; innings: number; runs: number; wickets: number; overs: number; extras: number }>
}

function MatchDetail() {
  const { matchId } = useParams()
  const [match, setMatch] = useState<MatchDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (matchId) {
      fetch(`/api/matches/${matchId}`)
        .then(r => r.json())
        .then(data => {
          if (!data.error) setMatch(data)
        })
        .finally(() => setLoading(false))
    }
  }, [matchId])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="loading">Loading match details...</div>
  if (!match) return <div className="empty-state">Match not found</div>

  return (
    <div className="page">
      <Link to="/matches" className="back-btn">← Back to Matches</Link>
      
      <div className={`match-header ${match.status.toLowerCase()}`}>
        {match.status === 'LIVE' && <span className="live-badge"><span className="pulse"></span> LIVE</span>}
        <span className="match-type">{match.status}</span>
      </div>

      <h2>{match.match_name}</h2>
      <p className="match-date">{formatDate(match.date)}</p>
      <p className="match-venue">📍 {match.venue}</p>

      <div className="scoreboard">
        <div className="team-score">
          <span className="team-name">{match.team1.name}</span>
          <span className="score">{match.team1.score || '-'}</span>
          <span className="overs">{match.team1.overs > 0 ? `(${match.team1.overs} ov)` : ''}</span>
        </div>
        
        <div className="vs-large">vs</div>
        
        <div className="team-score">
          <span className="team-name">{match.team2.name}</span>
          <span className="score">{match.team2.score || '-'}</span>
          <span className="overs">{match.team2.overs > 0 ? `(${match.team2.overs} ov)` : ''}</span>
        </div>
      </div>

      {match.result && (
        <div className="result-box">
          <span>{match.result}</span>
        </div>
      )}

      {match.scorecards && match.scorecards.length > 0 && (
        <div className="scorecards">
          <h3>Scorecard</h3>
          {match.scorecards.map((sc, i) => (
            <div key={i} className="innings-card">
              <h4>{sc.team_name} - {sc.innings === 1 ? '1st Innings' : '2nd Innings'}</h4>
              <div className="innings-score">
                <span className="runs">{sc.runs}/{sc.wickets}</span>
                <span className="overs">({sc.overs} ov)</span>
              </div>
              <p className="extras">Extras: {sc.extras}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchDetail