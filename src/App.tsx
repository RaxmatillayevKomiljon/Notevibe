import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/app/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Dashboard />} /> {/* Temp placeholder */}
            <Route path="/bookmarks" element={<Dashboard />} /> {/* Temp placeholder */}
            <Route path="/profile" element={<Dashboard />} /> {/* Temp placeholder */}
            <Route path="/create-post" element={<div className="text-center py-20">Editor Tez Orada...</div>} />
          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
