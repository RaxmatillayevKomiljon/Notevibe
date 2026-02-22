import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/app/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CreatePost } from './pages/CreatePost';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage';

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
              <Route path="/explore" element={<PlaceholderPage title="Kesht etish" />} />
              <Route path="/bookmarks" element={<PlaceholderPage title="Saqlanganlar" />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create-post" element={<CreatePost />} />
            </Route>

          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
