import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchJson, SiteStatus } from '../lib/cricket'

const ADMIN_SESSION_KEY = 'ipl-admin-session'

function AdminDashboard() {
  const [status, setStatus] = useState<SiteStatus | null>(null)
  const [message, setMessage] = useState('')
  const [working, setWorking] = useState(false)
  const navigate = useNavigate()

  const loadStatus = async () => {
    const data = await fetchJson<SiteStatus>('/api/status').catch(() => null)
    return data
  }

  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!session) {
      navigate('/admin')
      return
    }

    let active = true

    loadStatus().then((data) => {
      if (active) setStatus(data)
    })

    return () => {
      active = false
    }
  }, [navigate])

  const runAction = async (endpoint: string, label: string) => {
    setWorking(true)
    setMessage('')

    const response = await fetch(endpoint, { method: 'POST' })
    const payload = await response.json().catch(() => ({}))
    setMessage(payload.message ?? payload.error ?? `${label} finished`)
    const nextStatus = await loadStatus()
    setStatus(nextStatus)
    setWorking(false)
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    navigate('/admin')
  }

  if (!status) return <div className="loading">Loading admin status...</div>

  return (
    <div className="page-stack">
      <div className="page-banner">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Sync and inspect the data layer</h1>
          <p>These controls now talk to the endpoints that actually exist in this backend.</p>
        </div>
        <button onClick={handleLogout} className="ghost-link">Logout</button>
      </div>

      <div className="admin-stat-grid">
        <article className="glass-card compact">
          <strong>{status.matches}</strong>
          <span>Tracked matches</span>
        </article>
        <article className="glass-card compact">
          <strong>{status.teams}</strong>
          <span>Teams</span>
        </article>
        <article className="glass-card compact">
          <strong>{status.players}</strong>
          <span>Players</span>
        </article>
        <article className="glass-card compact">
          <strong>{status.scraper?.available ? 'Live' : 'Down'}</strong>
          <span>Scraper bridge</span>
        </article>
      </div>

      <section className="glass-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Sync tools</span>
            <h2>Refresh local content</h2>
          </div>
        </div>

        <div className="admin-action-row">
          <button disabled={working} onClick={() => runAction('/api/sync', 'Match sync')}>Sync matches</button>
          <button disabled={working} onClick={() => runAction('/api/sync/teams', 'Team sync')}>Sync teams</button>
          <button disabled={working} onClick={() => runAction('/api/sync/players', 'Player sync')}>Sync players</button>
        </div>

        {message && <div className="notice-banner">{message}</div>}
      </section>

      <section className="glass-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Backend status</span>
            <h2>Current health snapshot</h2>
          </div>
        </div>

        <div className="status-list">
          <div><strong>API key configured:</strong> {status.api_key_configured ? 'yes' : 'no'}</div>
          <div><strong>Live tracked matches:</strong> {status.live_matches}</div>
          <div><strong>Upcoming tracked matches:</strong> {status.upcoming_matches}</div>
          <div><strong>Completed tracked matches:</strong> {status.completed_matches}</div>
          <div><strong>Scraper season:</strong> {status.scraper?.season ?? 'Unavailable'}</div>
          {status.scraper?.message && <div><strong>Scraper message:</strong> {status.scraper.message}</div>}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
