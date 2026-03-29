import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-[#212121] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
