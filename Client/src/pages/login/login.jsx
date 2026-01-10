import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../Hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--desktop-bg)] flex items-center justify-center p-4">
      <div className="retro-window w-full max-w-[420px] bg-[var(--window-bg)]">

        {/* Window Header */}
        <div className="window-header">
          <span>🔐 Login</span>
          <div className="window-dots">
            <span className="dot bg-red-400"></span>
            <span className="dot bg-yellow-400"></span>
            <span className="dot bg-green-400"></span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            Welcome back 👋
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Enter your credentials to access Chat_OS
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Username"
              className="retro-field w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="retro-field w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="retro-button w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Enter Chat"}
            </button>

            <p className="text-sm text-center text-[var(--text-muted)]">
              Don’t have an account?{" "}
              <Link to="/signup" className="retro-link">
                Create one
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );


};

export default Login;