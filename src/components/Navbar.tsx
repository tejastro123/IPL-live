import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, User, LogOut, Trophy, Home, Users, Radio, Calendar, BarChart3, Table2, Newspaper, Target } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/live', label: 'Live Scores', icon: Radio },
  { to: '/fixtures', label: 'Fixtures', icon: Calendar },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/points-table', label: 'Points Table', icon: Table2 },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/predictions', label: 'Predictions', icon: Target },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-ipl-navy/95 backdrop-blur-md border-b border-ipl-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ipl-gold to-yellow-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-ipl-dark" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight tracking-tight">IPL 2026</span>
              <span className="text-[10px] text-ipl-gold font-medium leading-none tracking-widest uppercase">Official</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-ipl-gold/15 text-ipl-gold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-ipl-surface border border-ipl-border flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="max-w-24 truncate">Profile</span>
                </Link>
                <button onClick={signOut} className="text-gray-400 hover:text-red-400 transition-colors" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-ipl-navy border-t border-ipl-border animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-ipl-gold/15 text-ipl-gold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-ipl-border pt-3 mt-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white">
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 w-full">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm py-2.5">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
