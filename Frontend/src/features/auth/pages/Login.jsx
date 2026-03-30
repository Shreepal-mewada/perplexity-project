import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { Sparkles } from "lucide-react";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import { AnimatedAuthCard } from "@/components/ui/animated-auth-card";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const globalError = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const validate = (emailVal, passVal) => {
    const newErrors = {};
    if (!emailVal.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(emailVal)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!passVal) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    const validationErrors = validate(email, password);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await handleLogin({ email, password });
    // Note: Do not clear fields here. Only redirect on success (handled by useEffect).
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <AnimatedAuthCard>
        <div className="text-center space-y-3 relative z-10">
          <NavLink to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              WebCore AI
            </span>
          </NavLink>
          <p className="text-muted-foreground text-sm">
            Welcome back. Sign in to continue.
          </p>
        </div>

        {globalError &&
          !globalError.toLowerCase().includes("refresh token") && (
            <div className="p-3 mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium relative z-10 relative z-10">
              {globalError}
            </div>
          )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 relative z-10 mt-6 mt-6"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onBlur={() => handleBlur("email")}
              onChange={handleChangeEmail}
              className={`w-full px-4 py-3 rounded-xl bg-surface/50 border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                  : "border-border focus:ring-primary/50"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onBlur={() => handleBlur("password")}
              onChange={handleChangePassword}
              className={`w-full px-4 py-3 rounded-xl bg-surface/50 border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                  : "border-border focus:ring-primary/50"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                {errors.password}
              </p>
            )}
          </div>

          <ButtonWithIcon
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground glow-blue-sm disabled:opacity-70 mt-4 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </ButtonWithIcon>
        </form>

        <p className="text-center text-sm text-muted-foreground pt-6 border-t border-border/40 relative z-10">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="cursor-target text-primary hover:underline font-medium"
          >
            Register
          </NavLink>
        </p>
      </AnimatedAuthCard>
    </div>
  );
}

export default Login;
