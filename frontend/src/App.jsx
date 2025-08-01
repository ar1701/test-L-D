import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

// Admin Components
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AnalyticsConsultantDashboard } from "./components/admin/InternDashboard";

// LD SaaS Platform Components
import HomePage from "./components/ld-saas-platform/HomePage";
import RegisterPage from "./components/ld-saas-platform/RegisterPage";
import DashboardPage from "./components/ld-saas-platform/DashboardPage";
import RegisterSuccessPage from "./components/ld-saas-platform/RegisterSuccessPage";

// API Service
import { apiService } from "./services/api";
import { API_CONFIG } from "./config/api";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
    // In a real app, you'd get the token from the API response
    localStorage.setItem("authToken", "mock-token-" + userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="App">
          <Routes>
            {/* Admin Portal Routes */}
            <Route
              path="/admin-portal"
              element={
                <AdminPortalRoute
                  user={user}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/admin-portal/*"
              element={
                <AdminPortalRoute
                  user={user}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              }
            />

            {/* User Portal (LD SaaS Platform) Routes */}
            <Route
              path="/user-portal/*"
              element={
                <UserPortalRoute
                  user={user}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              }
            />

            {/* Legacy routes for backward compatibility */}
            <Route
              path="/login"
              element={<Navigate to="/user-portal/register" replace />}
            />
            <Route
              path="/register"
              element={<Navigate to="/user-portal/register" replace />}
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/user-portal/dashboard" replace />}
            />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/user-portal" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Admin Portal Component
function AdminPortalRoute({ user, onLogin, onLogout }) {
  const location = useLocation();

  // If user is not logged in, show login
  if (!user) {
    return <AdminLogin onLogin={onLogin} />;
  }

  // If user is admin, show admin dashboard
  if (user.role === "admin") {
    return (
      <div>
        <div className="bg-white border-b px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-sm text-gray-600">Admin Portal</span>
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // If user is intern, redirect to intern dashboard
  if (user.role === "intern") {
    return <Navigate to="/user-portal/intern" replace />;
  }

  // For any other role, show login
  return <AdminLogin onLogin={onLogin} />;
}

// User Portal Component with nested routing
function UserPortalRoute({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage onLogin={onLogin} />} />
      <Route path="/register-success" element={<RegisterSuccessPage />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardPage user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/user-portal/register" replace />
          )
        }
      />

      <Route
        path="/intern"
        element={
          user && user.role === "intern" ? (
            <AnalyticsConsultantDashboard user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/admin-portal" replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to="/user-portal/register" replace />}
      />
    </Routes>
  );
}

export default App;
