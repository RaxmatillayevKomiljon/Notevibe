import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/app/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CreatePost } from './pages/CreatePost';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { ExplorePage } from './pages/ExplorePage';
import { BookmarksPage } from './pages/BookmarksPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPage } from './pages/AdminPage';
import { PostPage } from './pages/PostPage';

import { AuthProvider } from './components/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>

          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
