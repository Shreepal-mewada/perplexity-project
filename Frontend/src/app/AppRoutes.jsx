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
      <Route
        path="/"
        element={
          <PublicRoute>
            <div className="animate-in fade-in zoom-in-[0.99] duration-500 ease-out h-full w-full">
              <Landing />
            </div>
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <div className="animate-in fade-in zoom-in-[0.99] duration-500 ease-out h-full w-full">
              <Login />
            </div>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <div className="animate-in fade-in zoom-in-[0.99] duration-500 ease-out h-full w-full">
              <Register />
            </div>
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <div className="animate-in fade-in duration-700 ease-out h-full w-full">
              <Dashboard />
            </div>
          </Protected>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
