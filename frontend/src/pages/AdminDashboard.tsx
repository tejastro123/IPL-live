import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      navigate('/admin')
      return
    }
    setToken(storedToken)
    fetchStatus(storedToken)
  }, [navigate])

  const fetchStatus = async (authToken: string) => {
    try {
      const res = await fetch('/api/status', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      setStatus(await res.json())
    } catch {
      console.error('Error fetching status')
    }
  }

  const handleRefresh = async () => {
    if (!token) return
    setRefreshing(true)
    try {
      const res = await fetch('/api/refresh', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      alert(`Refreshed! Found ${Array.isArray(data) ? data.length : 0} matches`)
    } catch {
      alert('Refresh failed')
    } finally {
      setRefreshing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin')
  }

  if (!status) return <div className="loading">Loading...</div>

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>⚙️ Admin Dashboard</h1>
          <p>IPL 2026 Live Score Management</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="status-cards">
        <div className="status-card">
          <h3>API Status</h3>
          <p className={status.api_key_configured ? 'success' : 'error'}>
            {status.api_key_configured ? '✅ API Key Configured' : '❌ No API Key'}
          </p>
        </div>
        
        <div className="status-card">
          <h3>Live Updates</h3>
          <p className={status.live_updates === 'enabled' ? 'success' : ''}>
            {status.live_updates === 'enabled' ? '✅ Auto-updates Active' : '⚠️ Disabled'}
          </p>
        </div>
        
        <div className="status-card">
          <h3>WebSocket</h3>
          <p className="success">{status.websocket === 'enabled' ? '✅ Connected' : '❌ Disconnected'}</p>
        </div>
      </div>

      <div className="admin-section">
        <h3>Actions</h3>
        <button onClick={handleRefresh} disabled={refreshing} className="action-btn">
          {refreshing ? '🔄 Fetching...' : '🔄 Fetch Latest Matches from API'}
        </button>
      </div>

      <div className="admin-section">
        <h3>API Key Setup</h3>
        <p>To enable live data, add your cricketdata.org API key to backend/.env:</p>
        <code>CRICKET_API_KEY=your_api_key_here</code>
        <p className="hint">Get free API key at: https://cricketdata.org</p>
      </div>
    </div>
  )
}

export default AdminDashboard