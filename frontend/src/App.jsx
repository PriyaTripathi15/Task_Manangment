
import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import api from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const onAuthSuccess = (payload) => {
    setUser(payload.user);
    navigate("/");
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-700/30 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-slate-100">
          <h1 className="font-bold tracking-wide">Team Task Manager</h1>
          <div className="flex items-center gap-4">
            {user && <Link to="/">Dashboard</Link>}
            {user ? (
              <button onClick={onLogout} className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-slate-950">
                Logout
              </button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onAuthSuccess={onAuthSuccess} />}
        />
        <Route
          path="/"
          element={user ? <Dashboard currentUser={user} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}
