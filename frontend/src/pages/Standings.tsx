import { useEffect, useState } from 'react'
import { fetchJson, PointsRow } from '../lib/cricket'

function Standings() {
  const [standings, setStandings] = useState<PointsRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetchJson<PointsRow[]>('/api/points-table')
      .then((data) => {
        if (active) setStandings(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (active) setStandings([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) return <div className="loading">Loading standings...</div>

  return (
    <div className="page-stack">
      <div className="page-banner">
        <div>
          <span className="eyebrow">Points table</span>
          <h1>Standings and qualification race</h1>
          <p>The page now falls back to the scraped IPL table when your local database has not been synced yet.</p>
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="empty-state">
          <p>No standings data available right now.</p>
        </div>
      ) : (
        <section className="glass-card">
          <div className="standings-header-row">
            <span>#</span>
            <span>Team</span>
            <span>P</span>
            <span>W</span>
            <span>L</span>
            <span>NR</span>
            <span>NRR</span>
            <span>Pts</span>
          </div>

          {standings.map((team, index) => (
            <div key={team.team_id} className={`standings-row ${index < 4 ? 'qualifier' : ''}`}>
              <span>{index + 1}</span>
              <span className="team-name-cell">
                <strong>{team.team_short}</strong>
                <small>{team.team_name}</small>
              </span>
              <span>{team.played}</span>
              <span>{team.won}</span>
              <span>{team.lost}</span>
              <span>{team.no_result}</span>
              <span>{team.net_run_rate}</span>
              <span className="points-cell">{team.points}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default Standings
