import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    if (location.pathname !== "/login") {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-6xl mt-4 p-4 bg-gray-100 rounded-lg mx-auto shadow-lg">
      <nav className="flex justify-between items-center">
        <div className="font-bold text-2xl text-blue-500 mx-2">
          {auth ? <Link to="/dashboard">Taskify</Link> : <span>Taskify</span>}
        </div>
        <div className="flex">
          {auth ? (
            <button
              onClick={handleLogout}
              className="p-2 border rounded-xl text-white bg-red-600 mx-2 hover:bg-red-800"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="p-2 border rounded-xl bg-gray-200 mx-2 hover:bg-gray-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="p-2 border rounded-xl text-white bg-blue-600 mx-2 hover:bg-blue-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
