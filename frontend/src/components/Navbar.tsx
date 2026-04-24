import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand-lockup">
        <span className="brand-mark">IP</span>
        <span>
          <strong>IPL Pulse</strong>
          <small>Season control room</small>
        </span>
      </NavLink>

      <nav className="site-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
        <NavLink to="/matches" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Matches</NavLink>
        <NavLink to="/standings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Standings</NavLink>
        <NavLink to="/teams" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Teams</NavLink>
        <NavLink to="/players" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Players</NavLink>
      </nav>

      <NavLink to="/admin" className="admin-link">Admin</NavLink>
    </header>
  )
}

export default Navbar
