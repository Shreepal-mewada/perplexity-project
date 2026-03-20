import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  // const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // const message = useSelector((state) => state.auth.message);
  // const error = useSelector((state) => state.auth.error);

  const { handleRegister } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleRegister({ username, email, password });
    // console.log(user);
    // console.log(result);
    // console.log(error);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Join and start exploring
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourusername"
              className="mt-1 w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#31b8c6] hover:bg-[#2aa4b0] text-white py-2 rounded-lg font-semibold transition transform hover:scale-[1.02]"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-[#31b8c6] hover:text-[#2aa4b0] font-medium"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
