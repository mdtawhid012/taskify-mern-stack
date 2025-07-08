import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(!!token);
  }, []);

  const RequireAuth = ({ children }) => {
    return auth ? children : <Navigate to="/login" />;
  };

  const RedirectIfAuth = ({ children }) => {
    return auth ? <Navigate to="/dashboard" /> : children;
  };

  return (
    <BrowserRouter>
      <Navbar auth={auth} setAuth={setAuth} />
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login setAuth={setAuth} />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <Signup setAuth={setAuth} />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={<Navigate to={auth ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
