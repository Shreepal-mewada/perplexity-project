import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { AppLoadingSkeleton } from "../components/ui/app-loading-skeleton";
import { useSelector, useDispatch } from "react-redux";
import { resetChatState } from "../features/chat/chat.slice";
import BackendStatusPopup from "../components/BackendStatusPopup";

function App() {
  const { handleRefresh, handleGetme } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const initialized = useRef(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const refreshResult = await handleRefresh();
      if (refreshResult) {
        await handleGetme();
      }
      setAuthLoading(false);
    })();
  }, [handleRefresh, handleGetme]);

  // 🔒 SECURITY FIX: Clear chat state when user logs out (detected by user becoming null after being set)
  const prevUserRef = useRef(null);
  useEffect(() => {
    if (prevUserRef.current && !user) {
      // User was logged out - clear chat state
      dispatch(resetChatState());
    }
    prevUserRef.current = user;
  }, [user, dispatch]);

  if (authLoading) {
    return <AppLoadingSkeleton />;
  }

  return (
    <BrowserRouter>
      <>
        {" "}
        <BackendStatusPopup />
        <AppRoutes />
      </>
    </BrowserRouter>
  );
}

export default App;
