import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import FormInput from '../components/FormInput';
import AuthLayout from '../components/AuthLayout'; // Import the new layout

const LoginPage = () => {
  const [email, setEmail] = useState('vikash@gmail.com');
  const [password, setPassword] = useState('Vikash@123');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h2>
        <p className="text-slate-500 mb-6">Log in to manage your shifts.</p>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          <FormInput id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign Up Here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;