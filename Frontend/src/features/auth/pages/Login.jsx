import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { Sparkles } from "lucide-react";
import TargetCursor from "../../landing/components/TargetCursor";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import { AnimatedAuthCard } from "@/components/ui/animated-auth-card";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <TargetCursor targetSelector=".cursor-target" />
      
      <AnimatedAuthCard>
        
        <div className="text-center space-y-3 relative z-10">
          <NavLink to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">Zyricon AI</span>
          </NavLink>
          <p className="text-muted-foreground text-sm">Welcome back. Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <ButtonWithIcon
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground glow-blue-sm disabled:opacity-50 mt-4"
          >
            {loading ? "Signing In..." : "Sign In"}
          </ButtonWithIcon>
        </form>

        <p className="text-center text-sm text-muted-foreground pt-6 border-t border-border/40 relative z-10">
          Don't have an account?{" "}
          <NavLink to="/register" className="cursor-target text-primary hover:underline font-medium">
            Register
          </NavLink>
        </p>
      </AnimatedAuthCard>
    </div>
  );
}

export default Login;
