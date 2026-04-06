import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { Sparkles, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { AnimatedAuthCard } from "@/components/ui/animated-auth-card";
import { verifyEmail } from "../services/auth.api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    async function handleVerify() {
      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus("success");
          setMessage(result.message || "Email verified successfully. Redirecting to login...");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.message || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "An error occurred during verification.");
      }
    }

    handleVerify();
  }, [searchParams, navigate]);

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
        </div>

        <div className="flex flex-col items-center justify-center py-8 relative z-10">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground text-sm">
                Verifying your email...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-foreground font-medium text-center">
                {message}
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium text-center mb-4">
                {message}
              </p>
              <NavLink
                to="/login"
                className="text-primary hover:underline font-medium text-sm"
              >
                Go to Login
              </NavLink>
            </>
          )}
        </div>
      </AnimatedAuthCard>
    </div>
  );
}

export default VerifyEmail;
