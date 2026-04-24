import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchJson, formatDate, MatchDetailRecord } from '../lib/cricket'

function MatchDetail() {
  const { matchId } = useParams()
  const [match, setMatch] = useState<MatchDetailRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!matchId) return
    let active = true

    fetchJson<MatchDetailRecord>(`/api/matches/${matchId}`)
      .then((data) => {
        if (active && !(data as { error?: string }).error) {
          setMatch(data)
        }
      })
      .catch(() => {
        if (active) setMatch(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [matchId])

  if (loading) return <div className="loading">Loading match details...</div>
  if (!match) return <div className="empty-state">Match not found.</div>

  return (
    <div className="page-stack">
      <Link to="/matches" className="ghost-link">Back to matches</Link>

      <section className="match-detail-hero">
        <div className="tracked-match-meta">
          <span className={`status-pill ${match.status === 'LIVE' ? 'live' : match.status === 'COMPLETED' ? 'completed' : 'upcoming'}`}>
            {match.status}
          </span>
          <span>{match.match_type}</span>
        </div>

        <h1>{match.match_name}</h1>
        <p>{formatDate(match.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <p>{match.venue}</p>

        <div className="detail-scoreboard">
          <div className="detail-team-score">
            <span>{match.team1.name}</span>
            <strong>{match.team1.score || '-'}</strong>
            <small>{match.team1.overs > 0 ? `${match.team1.overs} overs` : 'Yet to bat'}</small>
          </div>

          <span className="versus-separator">vs</span>

          <div className="detail-team-score">
            <span>{match.team2.name}</span>
            <strong>{match.team2.score || '-'}</strong>
            <small>{match.team2.overs > 0 ? `${match.team2.overs} overs` : 'Yet to bat'}</small>
          </div>
        </div>

        {match.result && <div className="result-banner">{match.result}</div>}
      </section>

      {match.scorecards?.length > 0 && (
        <section className="glass-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Score breakdown</span>
              <h2>Innings summary</h2>
            </div>
          </div>

          <div className="innings-grid">
            {match.scorecards.map((scorecard, index) => (
              <article key={`${scorecard.team_name}-${index}`} className="innings-card">
                <strong>{scorecard.team_name}</strong>
                <p>{scorecard.innings === 1 ? 'First innings' : 'Second innings'}</p>
                <div className="innings-scoreline">
                  <span>{scorecard.runs}/{scorecard.wickets}</span>
                  <small>{scorecard.overs} overs</small>
                </div>
                <small>Extras: {scorecard.extras}</small>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MatchDetail
