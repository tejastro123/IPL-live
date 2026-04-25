import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import LiveScoresPage from './pages/LiveScoresPage';
import MatchDetailPage from './pages/MatchDetailPage';
import FixturesPage from './pages/FixturesPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import PointsTablePage from './pages/PointsTablePage';
import NewsPage from './pages/NewsPage';
import NewsArticlePage from './pages/NewsArticlePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PredictionsPage from './pages/PredictionsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetailPage />} />
            <Route path="/live" element={<LiveScoresPage />} />
            <Route path="/match/:id" element={<MatchDetailPage />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/stats" element={<PlayerStatsPage />} />
            <Route path="/points-table" element={<PointsTablePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
