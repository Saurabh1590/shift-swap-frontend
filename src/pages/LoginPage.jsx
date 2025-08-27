import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FormInput from "../components/FormInput";
import AuthLayout from "../components/AuthLayout";

const LoginPage = () => {
  // Pre-fill with admin account for convenience
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome Back!
        </h2>
        <p className="text-slate-500 mb-6">Log in to manage your shifts.</p>

        {/* Demo Accounts Panel - Minimized Details */}
        <div className="bg-slate-100 border border-slate-200 p-4 rounded-lg mb-5 text-sm">
          <p className="font-bold text-slate-700 text-center mb-2">
            Demo Accounts
          </p>

          <div className="text-slate-600 space-y-1 mb-3">
            <p>
              <strong>Admin:</strong>{" "}
              <span className="font-mono ml-1">admin@test.com</span> /{" "}
              <span className="font-mono">Admin@123</span>
            </p>
            <p>
              <strong>Users:</strong>{" "}
              <span className="font-mono ml-1">Demo@gmail.com</span>,{" "}
              <span className="font-mono">Demo1@gmail.com</span>
            </p>
            <p className="pl-6">
              <strong>Password for both:</strong>{" "}
              <span className="font-mono ml-1">Demo@123</span>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-300 text-xs text-slate-500 flex items-start">
            <span className="mr-2 mt-0.5">💡</span>
            <p>
              Admin login unlocks management features; Users see standard view.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </p>
          )}
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign Up Here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
