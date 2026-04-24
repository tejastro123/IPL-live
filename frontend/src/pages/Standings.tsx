import { useEffect, useState } from 'react'

interface TeamStanding {
  team_id: string
  team_name: string
  team_short: string
  played: number
  won: number
  lost: number
  tied: number
  no_result: number
  points: number
  net_run_rate: number
}

function Standings() {
  const [standings, setStandings] = useState<TeamStanding[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/points-table')
      .then(r => r.json())
      .then(data => setStandings(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading standings...</div>

  return (
    <div className="page">
      <h2>📊 Points Table</h2>
      
      {standings.length === 0 ? (
        <div className="empty-state">
          <p>No data yet. Sync matches to see standings.</p>
        </div>
      ) : (
        <div className="standings-table">
          <div className="table-header">
            <span className="pos">#</span>
            <span className="team">Team</span>
            <span className="stat">P</span>
            <span className="stat">W</span>
            <span className="stat">L</span>
            <span className="stat">Pts</span>
          </div>
          {standings.map((t, i) => (
            <div key={t.team_id} className={`table-row ${i < 4 ? 'playoffs' : ''}`}>
              <span className="pos">{i + 1}</span>
              <span className="team">
                <span className="team-badge">{t.team_short}</span>
                {t.team_name}
              </span>
              <span className="stat">{t.played}</span>
              <span className="stat won">{t.won}</span>
              <span className="stat lost">{t.lost}</span>
              <span className="stat points">{t.points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Standings