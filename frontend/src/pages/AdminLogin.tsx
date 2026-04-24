import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'ipl-admin-session'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (username === 'admin' && password === 'ipl2024') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'active')
      navigate('/admin/dashboard')
      return
    }

    setError('Invalid credentials')
  }

  return (
    <div className="auth-shell">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="eyebrow">Admin</span>
        <h1>Control panel login</h1>
        <p>Use the local project credentials defined in `AGENTS.md`.</p>

        <label>
          Username
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-cta">Open dashboard</button>
      </form>
    </div>
  )
}

export default AdminLogin
