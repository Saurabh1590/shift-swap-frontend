import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import FormInput from '../components/FormInput';
import AuthLayout from '../components/AuthLayout'; // Import the new layout

const SignupPage = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Your Account</h2>
        <p className="text-slate-500 mb-6">Get started with ShiftSwap.</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          <FormInput id="firstName" label="First Name" onChange={handleChange} />
          <FormInput id="lastName" label="Last Name" onChange={handleChange} />
          <FormInput id="email" label="Email" type="email" onChange={handleChange} />
          <FormInput id="password" label="Password" type="password" onChange={handleChange} minLength="6" />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;