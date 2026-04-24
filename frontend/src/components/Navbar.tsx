import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#222', color: '#fff' }}>
      <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
        <li><Link to="/teams" style={{ color: '#fff', textDecoration: 'none' }}>Teams</Link></li>
        <li><Link to="/players" style={{ color: '#fff', textDecoration: 'none' }}>Players</Link></li>
        <li><Link to="/matches" style={{ color: '#fff', textDecoration: 'none' }}>Matches</Link></li>
        <li><Link to="/standings" style={{ color: '#fff', textDecoration: 'none' }}>Standings</Link></li>
        <li style={{ marginLeft: 'auto' }}><Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar