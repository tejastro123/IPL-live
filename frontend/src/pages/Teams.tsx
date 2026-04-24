import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Team {
  team_id: string
  name: string
  short_name: string
  logo_url: string
  primary_color: string
}

interface Player {
  player_id: string
  name: string
  team_id: string
  role: string
  batting_style: string
  bowling_style: string
  jersey_number: number
  image_url: string
}

function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { teamId } = useParams()

  useEffect(() => {
    Promise.all([
      fetch('/api/teams').then(r => r.json()),
      fetch('/api/players').then(r => r.json())
    ]).then(([teamsData, playersData]) => {
      setTeams(Array.isArray(teamsData) ? teamsData : [])
      setPlayers(Array.isArray(playersData) ? playersData : [])
      if (teamId) setSelectedTeam(teamId)
      setLoading(false)
    })
  }, [teamId])

  const teamPlayers = selectedTeam ? players.filter(p => p.team_id === selectedTeam) : []

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h2>🏆 IPL Teams</h2>
      
      <div className="team-tabs">
        {teams.map(t => (
          <button key={t.team_id} className={selectedTeam === t.team_id ? 'active' : ''} onClick={() => setSelectedTeam(t.team_id)}>
            {t.short_name}
          </button>
        ))}
      </div>

      {!selectedTeam ? (
        <div className="teams-grid">
          {teams.map(t => (
            <button key={t.team_id} className="team-card" onClick={() => setSelectedTeam(t.team_id)}>
              <span className="team-short">{t.short_name}</span>
              <span className="team-name">{t.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="team-detail">
          <button className="back-btn" onClick={() => setSelectedTeam(null)}>← All Teams</button>
          
          {teamPlayers.length > 0 ? (
            <>
              <h3>Players ({teamPlayers.length})</h3>
              <div className="players-grid">
                {teamPlayers.map(p => (
                  <div key={p.player_id} className="player-card">
                    <span className="jersey">#{p.jersey_number}</span>
                    <span className="name">{p.name}</span>
                    <span className="role">{p.role}</span>
                    <div className="styles">
                      <span>🏏 {p.batting_style}</span>
                      <span>🎯 {p.bowling_style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="empty">No players in this team.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Teams