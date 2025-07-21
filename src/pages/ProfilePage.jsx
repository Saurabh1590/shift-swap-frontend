import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import FormInput from '../components/FormInput';
import api from '../api/axios'; // Using the base api instance for a custom call

const ProfilePage = () => {
  const { user, setUser } = useAuth(); // Get setUser to update context after change
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    about: user?.about || '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await api.patch('/user/profile', formData);
      setUser(response.data.user); // Update the user in the global context
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">My Profile</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <FormInput
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="about">
              About Me
            </label>
            <textarea
              id="about"
              rows="4"
              className="w-full px-4 py-2 border rounded-lg text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
            ></textarea>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;