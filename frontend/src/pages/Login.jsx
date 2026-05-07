
import React, { useState } from "react";
import api from "../api";

export default function Login({ onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup
        ? form
        : { email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      onAuthSuccess(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-58px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/40 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-slate-800 p-1 text-sm">
          <button
            className={`w-1/2 rounded-lg px-3 py-2 font-semibold ${!isSignup ? "bg-teal-400 text-slate-900" : "text-slate-300"}`}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
          <button
            className={`w-1/2 rounded-lg px-3 py-2 font-semibold ${isSignup ? "bg-teal-400 text-slate-900" : "text-slate-300"}`}
            onClick={() => setIsSignup(true)}
          >
            Signup
          </button>
        </div>

        <h2 className="mb-4 text-2xl font-bold text-slate-100">
          {isSignup ? "Create an account" : "Welcome back"}
        </h2>

        {error && (
          <p className="mb-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        {isSignup && (
          <input
            className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {isSignup && (
          <select
            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-slate-950 disabled:opacity-70"
        >
          {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
        </button>
      </div>
    </div>
  );
}
