import { useEffect, useState } from 'react'

interface Player {
  player_id: string
  name: string
  team_id: string
  role: string
  batting_style: string
  bowling_style: string
  jersey_number: number
}

function Players() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/players')
      .then(r => r.json())
      .then(data => setPlayers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = players.filter(p => {
    if (filter !== 'all' && p.team_id !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h2>👥 All Players</h2>
      
      <div className="filters">
        <input type="text" placeholder="Search player..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Teams</option>
          <option value="RCB">RCB</option>
          <option value="MI">MI</option>
          <option value="CSK">CSK</option>
          <option value="DC">DC</option>
          <option value="KKR">KKR</option>
          <option value="RR">RR</option>
          <option value="PBKS">PBKS</option>
          <option value="LSG">LSG</option>
          <option value="SRH">SRH</option>
          <option value="GT">GT</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No players found.</p>
      ) : (
        <div className="players-list">
          {filtered.map(p => (
            <div key={p.player_id} className="player-row">
              <span className="jersey">#{p.jersey_number}</span>
              <span className="name">{p.name}</span>
              <span className="team">{p.team_id}</span>
              <span className="role">{p.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Players