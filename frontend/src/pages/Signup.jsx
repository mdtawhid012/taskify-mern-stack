import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup({ setAuth }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/signup", {
        name,
        username,
        password,
      });

      const loginRes = await axios.post(
        "http://localhost:3000/api/auth/signin",
        {
          username,
          password,
        }
      );

      const { token } = loginRes.data;
      localStorage.setItem("token", token);
      setAuth(true);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || "Sign up failed."
        );
      } else {
        setError("Failed to Sign up. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center w-full max-w-xl m-auto mt-12 bg-gray-100 rounded-md drop-shadow-md">
        <h2 className="font-bold text-lg pt-8 pt-4 mb-12">Sign Up</h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full mb-2"
        >
          <label htmlFor="name" />
          <input
            className="w-full max-w-sm border-2 rounded-md py-2 px-4 m-2"
            id="name"
            value={name}
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="username" />
          <input
            className="w-full max-w-sm border-2 rounded-md py-2 px-4 m-2"
            id="username"
            value={username}
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password" />
          <input
            className="w-full max-w-sm border-2 rounded-md py-2 px-4 m-2"
            id="password"
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 border m-2 rounded-lg p-2 text-white w-full max-w-xs hover:bg-blue-800"
          >
            Sign Up
          </button>
        </form>
        <p className="pb-4">
          Already have an account?{" "}
          <Link className="text-blue-500 underline" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
