import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchJson, getTeamMeta, PlayerRecord, TEAM_META, TeamRecord } from '../lib/cricket'

function Teams() {
  const [teams, setTeams] = useState<TeamRecord[]>([])
  const [players, setPlayers] = useState<PlayerRecord[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { teamId } = useParams()

  useEffect(() => {
    let active = true

    Promise.all([
      fetchJson<TeamRecord[]>('/api/teams').catch(() => []),
      fetchJson<PlayerRecord[]>('/api/players').catch(() => []),
    ]).then(([teamsData, playersData]) => {
      if (!active) return
      setTeams(Array.isArray(teamsData) ? teamsData : [])
      setPlayers(Array.isArray(playersData) ? playersData : [])
      setSelectedTeam(teamId ?? null)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [teamId])

  const fallbackTeams = Object.values(TEAM_META).map((team) => ({
    team_id: team.code,
    name: team.name,
    short_name: team.code,
    primary_color: team.color,
  }))

  const teamList = teams.length > 0 ? teams : fallbackTeams
  const teamPlayers = selectedTeam ? players.filter((player) => player.team_id === selectedTeam) : []

  if (loading) return <div className="loading">Loading teams...</div>

  return (
    <div className="page-stack">
      <div className="page-banner">
        <div>
          <span className="eyebrow">Franchise directory</span>
          <h1>All IPL teams</h1>
          <p>Browse the full league map and drill into locally synced rosters where available.</p>
        </div>
      </div>

      <div className="filter-row">
        {teamList.map((team) => (
          <button key={team.team_id} className={selectedTeam === team.team_id ? 'active' : ''} onClick={() => setSelectedTeam(team.team_id)}>
            {team.short_name}
          </button>
        ))}
      </div>

      {!selectedTeam ? (
        <div className="team-showcase-grid">
          {teamList.map((team) => {
            const meta = getTeamMeta(team.short_name, team.name)
            const rosterCount = players.filter((player) => player.team_id === team.team_id).length

            return (
              <button
                key={team.team_id}
                className="team-showcase-card"
                onClick={() => setSelectedTeam(team.team_id)}
                style={{ background: `linear-gradient(145deg, ${meta.color}, ${meta.accent})` }}
              >
                <span className="team-short">{team.short_name}</span>
                <strong>{team.name}</strong>
                <small>{rosterCount > 0 ? `${rosterCount} synced players` : 'Roster available after sync'}</small>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="glass-card">
          <button className="ghost-link" onClick={() => setSelectedTeam(null)}>Back to all teams</button>

          <div className="section-heading">
            <div>
              <span className="eyebrow">{selectedTeam}</span>
              <h2>{teamList.find((team) => team.team_id === selectedTeam)?.name ?? selectedTeam}</h2>
            </div>
          </div>

          {teamPlayers.length > 0 ? (
            <div className="roster-grid">
              {teamPlayers.map((player) => (
                <article key={player.player_id} className="roster-card">
                  <span className="jersey-badge">#{player.jersey_number || '--'}</span>
                  <strong>{player.name}</strong>
                  <p>{player.role}</p>
                  <small>{player.batting_style || 'Batting style TBA'}</small>
                  <small>{player.bowling_style || 'Bowling style TBA'}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No synced player roster for this team yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Teams
