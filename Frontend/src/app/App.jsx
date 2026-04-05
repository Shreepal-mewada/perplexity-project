import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { resetChatState } from "../features/chat/chat.slice";

const SERVER_BASE_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://perplexity-project-zac5.onrender.com";

const SESSION_FLAG = "server_confirmed_awake";
const HEALTH_TIMEOUT = 5000;
const POLL_INTERVAL = 2000;

function checkHealth() {
  return fetch(`${SERVER_BASE_URL}/health`, {
    signal: AbortSignal.timeout(HEALTH_TIMEOUT),
  }).then((res) => res.ok);
}

function AppLoadingSkeleton() {
  return (
    <div className="h-screen w-full bg-background flex items-center justify-center font-body">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <span className="text-muted-foreground text-sm">Loading app...</span>
      </div>
    </div>
  );
}

function WakeUpScreen({ elapsedSeconds }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-body">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="flex flex-col items-center gap-6 px-8 py-10 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-secondary/60 animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="font-semibold text-xl text-white">
            Server is starting...
          </span>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <svg
              className="w-4 h-4 text-primary/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-white/70 text-sm font-medium tabular-nums">
              {elapsedSeconds}s elapsed
            </span>
          </div>

          <span className="text-white/40 text-xs">
            Server usually starts within 20–40 seconds
          </span>
        </div>

        <div className="flex gap-1.5 mt-2">
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { handleRefresh, handleGetme } = useAuth();
  const [phase, setPhase] = useState("checking");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const initialized = useRef(false);
  const prevUserRef = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const markServerAwake = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_FLAG, "true");
    } catch {
      // storage unavailable
    }
  }, []);

  const wasServerAwake = useCallback(() => {
    try {
      return sessionStorage.getItem(SESSION_FLAG) === "true";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (wasServerAwake()) {
      setPhase("loading");
      return;
    }

    checkHealth()
      .then((ok) => {
        if (ok) {
          markServerAwake();
          setPhase("loading");
        } else {
          setPhase("sleeping");
        }
      })
      .catch(() => {
        setPhase("sleeping");
      });
  }, [markServerAwake, wasServerAwake]);

  useEffect(() => {
    if (phase !== "sleeping") return;

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${SERVER_BASE_URL}/health`, {
          signal: AbortSignal.timeout(HEALTH_TIMEOUT),
        });
        if (res.ok) {
          clearInterval(pollInterval);
          clearInterval(timerInterval);
          markServerAwake();
          setPhase("loading");
        }
      } catch {
        // still sleeping
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timerInterval);
    };
  }, [phase, markServerAwake]);

  useEffect(() => {
    if (phase !== "loading") return;

    (async () => {
      const refreshResult = await handleRefresh();
      if (refreshResult) {
        await handleGetme();
      }
      setPhase("ready");
    })();
  }, [phase, handleRefresh, handleGetme]);

  useEffect(() => {
    if (prevUserRef.current && !user) {
      dispatch(resetChatState());
    }
    prevUserRef.current = user;
  }, [user, dispatch]);

  if (phase === "sleeping") {
    return <WakeUpScreen elapsedSeconds={elapsedSeconds} />;
  }

  if (phase === "checking" || phase === "loading") {
    return <AppLoadingSkeleton />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
