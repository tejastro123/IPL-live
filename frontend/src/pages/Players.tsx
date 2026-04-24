import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { fetchJson, PlayerRecord, TEAM_META } from '../lib/cricket'

function Players() {
  const [players, setPlayers] = useState<PlayerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    let active = true

    fetchJson<PlayerRecord[]>('/api/players')
      .then((data) => {
        if (active) setPlayers(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (active) setPlayers([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredPlayers = players.filter((player) => {
    if (filter !== 'all' && player.team_id !== filter) return false
    if (deferredSearch && !player.name.toLowerCase().includes(deferredSearch.toLowerCase())) return false
    return true
  })

  if (loading) return <div className="loading">Loading players...</div>

  return (
    <div className="page-stack">
      <div className="page-banner">
        <div>
          <span className="eyebrow">Squad index</span>
          <h1>Player directory</h1>
          <p>Filter synced rosters by franchise or player name.</p>
        </div>
      </div>

      <div className="search-toolbar">
        <input
          type="text"
          placeholder="Search a player"
          value={search}
          onChange={(event) => {
            const nextValue = event.target.value
            startTransition(() => {
              setSearch(nextValue)
            })
          }}
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All teams</option>
          {Object.keys(TEAM_META).map((teamCode) => (
            <option key={teamCode} value={teamCode}>{teamCode}</option>
          ))}
        </select>
      </div>

      {filteredPlayers.length > 0 ? (
        <div className="player-directory-grid">
          {filteredPlayers.map((player) => (
            <article key={player.player_id} className="player-directory-card">
              <span className="jersey-badge">#{player.jersey_number || '--'}</span>
              <strong>{player.name}</strong>
              <p>{player.role}</p>
              <small>{player.team_id}</small>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No players matched your current filter.</p>
        </div>
      )}
    </div>
  )
}

export default Players
