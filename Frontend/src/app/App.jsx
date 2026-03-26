import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import { useAuth } from "../features/auth/hooks/useAuth";
// import { useSelector } from "react-redux";

function App() {
  const { handleRefresh, handleGetme } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const initialized = useRef(false);

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

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
