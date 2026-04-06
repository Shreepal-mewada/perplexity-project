import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import { AnimatedAuthCard } from "@/components/ui/animated-auth-card";
import { GoogleLogin } from "@react-oauth/google";
import logo1 from "../../../../public/spider_logo_2.png";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const globalError = useSelector((state) => state.auth.error);

  const navigate = useNavigate();
  const { handleRegister, handleGoogleAuth } = useAuth();

  useEffect(() => {
    console.log(
      "Register useEffect - user:",
      user,
      "loading:",
      loading,
      "userTruthy:",
      !!user,
    );
    console.log("User object details:", user);
    if (!loading && user) {
      console.log("Navigating to dashboard");
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const validate = (userVal, emailVal, passVal) => {
    const newErrors = {};
    if (!userVal.trim()) {
      newErrors.username = "Username is required";
    } else if (userVal.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!emailVal.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(emailVal)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!passVal) {
      newErrors.password = "Password is required";
    } else if (passVal.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    const validationErrors = validate(username, email, password);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleChange = (e, field, setter) => {
    setter(e.target.value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(username, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await handleRegister({ username, email, password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-4">
      <AnimatedAuthCard>
        <div className="text-center space-y-2 relative z-10">
          <NavLink to="/" className="inline-flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <img src={logo1} alt="Logo" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              WebCore AI
            </span>
          </NavLink>
          <p className="text-muted-foreground text-xs">
            Join and start exploring the future.
          </p>
        </div>

        {globalError &&
          !globalError.toLowerCase().includes("refresh token") && (
            <div className="p-2 mt-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-medium relative z-10">
              {globalError}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 mt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              autoComplete="username"
              onBlur={() => handleBlur("username")}
              onChange={(e) => handleChange(e, "username", setUsername)}
              className={`w-full px-4 py-3 rounded-xl bg-surface/50 border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                errors.username
                  ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                  : "border-border focus:ring-primary/50"
              }`}
              placeholder="yourusername"
            />
            {errors.username && (
              <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onBlur={() => handleBlur("email")}
              onChange={(e) => handleChange(e, "email", setEmail)}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                onBlur={() => handleBlur("password")}
                onChange={(e) => handleChange(e, "password", setPassword)}
                className={`w-full px-4 pr-11 py-3 rounded-xl bg-surface/50 border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                    : "border-border focus:ring-primary/50"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                {errors.password}
              </p>
            )}
          </div>

          <ButtonWithIcon
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground glow-blue-sm disabled:opacity-70 mt-3 flex items-center justify-center gap-2 transition-all text-sm py-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </ButtonWithIcon>
        </form>

        <div className="relative mt-3 relative z-10 w-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121212] px-2 text-muted-foreground w-fit rounded z-10 text-xs">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-2 relative z-10 flex justify-center w-full">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleAuth(credentialResponse.credential);
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
            theme="filled_black"
            shape="circle"
          />
        </div>

        <p className="text-center text-xs text-muted-foreground pt-1 relative z-10">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="cursor-target text-primary hover:underline font-medium"
          >
            Login
          </NavLink>
        </p>
      </AnimatedAuthCard>
    </div>
  );
}

export default Register;
