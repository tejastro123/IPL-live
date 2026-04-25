import { Link } from 'react-router-dom';
import { Trophy, Twitter, Instagram, Youtube, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ipl-navy border-t border-ipl-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ipl-gold to-yellow-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-ipl-dark" />
              </div>
              <span className="text-lg font-bold text-white">IPL 2026</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              The official destination for Indian Premier League 2026 coverage. Live scores, fixtures, stats, and more.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/live', label: 'Live Scores' },
                { to: '/fixtures', label: 'Fixtures' },
                { to: '/points-table', label: 'Points Table' },
                { to: '/stats', label: 'Statistics' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block text-sm text-gray-500 hover:text-ipl-gold transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Teams</h4>
            <div className="space-y-2">
              {['CSK', 'MI', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'LSG', 'GT'].map((team) => (
                <Link key={team} to="/teams" className="block text-sm text-gray-500 hover:text-ipl-gold transition-colors">
                  {team}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
                { icon: Github, label: 'GitHub' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-10 h-10 rounded-lg bg-ipl-surface border border-ipl-border flex items-center justify-center text-gray-500 hover:text-ipl-gold hover:border-ipl-gold/30 transition-all" title={label}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-ipl-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; 2026 IPL Coverage. All rights reserved. This is a fan-made project.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
