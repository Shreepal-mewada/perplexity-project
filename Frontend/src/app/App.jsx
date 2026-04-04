import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ColdStartIndicator } from "../components/ui/cold-start-indicator";
import { AppLoadingSkeleton } from "../components/ui/app-loading-skeleton";
import { useSelector, useDispatch } from "react-redux";
import { resetChatState } from "../features/chat/chat.slice";

const SERVER_BASE_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://perplexity-project-zac5.onrender.com";

async function waitForBackend(timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${SERVER_BASE_URL}/health`);
      if (res.ok) return true;
    } catch {
      // server not reachable yet, retry
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

async function isBackendAwake() {
  try {
    const res = await fetch(`${SERVER_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function retryWithDelay(fn, maxRetries = 3, delayMs = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await fn();
    if (result) return result;
    if (i < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
}

function App() {
  const { handleRefresh, handleGetme } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const [showColdStart, setShowColdStart] = useState(false);
  const [backendTimeout, setBackendTimeout] = useState(false);
  const initialized = useRef(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const awake = await isBackendAwake();

      if (!awake) {
        setShowColdStart(true);
        const wokeUp = await waitForBackend();
        if (!wokeUp) {
          setBackendTimeout(true);
          return;
        }
        setShowColdStart(false);
      }

      const refreshResult = await retryWithDelay(handleRefresh, 3, 2000);
      if (refreshResult) {
        await retryWithDelay(handleGetme, 3, 2000);
      }
      setAppReady(true);
    })();
  }, [handleRefresh, handleGetme]);

  const prevUserRef = useRef(null);
  useEffect(() => {
    if (prevUserRef.current && !user) {
      dispatch(resetChatState());
    }
    prevUserRef.current = user;
  }, [user, dispatch]);

  if (!appReady) {
    if (backendTimeout) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-4 font-body">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold">Server could not start</h2>
          <p className="text-muted-foreground text-center max-w-md">
            The backend server took too long to respond. This can happen when
            Render spins down after inactivity.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (showColdStart) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full"></div>
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <ColdStartIndicator />
          </div>
        </div>
      );
    }

    return <AppLoadingSkeleton />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
