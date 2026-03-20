import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  // redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleLogin({ email, password });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* title */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-6">Login to your account</p>

        {/* error message
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/30 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )} */}

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#31b8c6] transition"
            />
          </div>

          {/* password */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#31b8c6] transition"
            />
          </div>

          {/* button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#31b8c6] hover:bg-[#2aa4b0] text-white py-2 rounded-lg font-semibold transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* register link */}
        <p className="text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-[#31b8c6] hover:text-[#2aa4b0] font-medium"
          >
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
