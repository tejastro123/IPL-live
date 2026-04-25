import { useAuth, } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useData';
import { Navigate } from 'react-router-dom';
import { User, Trophy, Target, Star } from 'lucide-react';
import AuthGuard from '../components/AuthGuard';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AuthGuard>
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-ipl-surface border border-ipl-border flex items-center justify-center">
                <User className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profile?.display_name || profile?.username || 'User'}</h1>
                <p className="text-sm text-gray-500 mt-1">@{profile?.username || 'username'}</p>
                <p className="text-xs text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card p-5 text-center">
              <Target className="w-6 h-6 text-ipl-gold mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{profile?.prediction_points || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Prediction Points</p>
            </div>
            <div className="card p-5 text-center">
              <Trophy className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500 mt-1">Correct Predictions</p>
            </div>
            <div className="card p-5 text-center">
              <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500 mt-1">Total Predictions</p>
            </div>
          </div>

          {/* Favorite Team */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-ipl-border/30">
                <span className="text-sm text-gray-500">Member since</span>
                <span className="text-sm text-white">{new Date(profile?.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-ipl-border/30">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm text-white">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">Favorite Team</span>
                <span className="text-sm text-ipl-gold">{profile?.favorite_team_id ? 'Set' : 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
