import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {useAuth} from './components/auth/AuthProvider';
import Login from './components/auth/Login';
import EmailVerification from './components/auth/EmailVerification';
import PasswordReset from './components/auth/PasswordReset';
import RequestPasswordReset from './components/auth/RequestPasswordReset';
import PasswordResetRequested from './components/auth/PasswordResetRequested';
import Demo from './components/demo/Demo';
import BotDemo from './components/demo/BotDemo';
import Dashboard from './components/Dashboard';
import Sandbox from './components/Sandbox';
import SharedConversation from './components/conversations/SharedConversation';
import './App.css';

// Component to handle catch-all redirects
const CatchAllRoute = () => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isAuthenticated) {
    return <Navigate to="/conversations/all" replace />;
  }

  return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
};

const App = () => {
  const auth = useAuth();

  if (auth.loading) {
    return null; // FIXME: show loading icon
  }

  // Single Router for all routes - prevents state loss on navigation
  return (
    <Router>
      <Routes>
        {/* Public routes - accessible regardless of auth state */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/bot/demo" element={<BotDemo />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/share" element={<SharedConversation />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/reset-password" element={<RequestPasswordReset />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route
          path="/reset-password-requested"
          element={<PasswordResetRequested />}
        />
        <Route path="/login" element={<Login />} />

        {/* Protected routes - require authentication */}
        {auth.isAuthenticated && <Route path="/*" element={<Dashboard />} />}

        {/* Catch-all route */}
        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </Router>
  );
};

export default App;
