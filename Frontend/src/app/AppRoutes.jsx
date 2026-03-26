import React from "react";
import { Routes, Route } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import PublicRoute from "../features/auth/components/PublicRoute";
import Landing from "../features/landing/pages/Landing";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    </Routes>
  );
}

export default AppRoutes;
