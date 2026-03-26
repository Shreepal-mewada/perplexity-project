import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function PublicRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-[#212121] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return children;
}

export default PublicRoute;
