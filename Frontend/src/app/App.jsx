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

async function waitForBackend(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${SERVER_BASE_URL}/health`);
      if (res.ok) return true;
    } catch {
      // server not reachable yet, retry
    }
    await new Promise((r) => setTimeout(r, 1000));
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

function App() {
  const { handleRefresh, handleGetme } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const [showColdStart, setShowColdStart] = useState(false);
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
        await waitForBackend();
        setShowColdStart(false);
      }

      const refreshResult = await handleRefresh();
      if (refreshResult) {
        await handleGetme();
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
    if (!showColdStart) {
      return <AppLoadingSkeleton />;
    }
    return (
      <>
        <iframe
          src={SERVER_BASE_URL}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            border: "none",
            zIndex: 1,
          }}
          title="Backend cold start"
        />
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
      </>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
