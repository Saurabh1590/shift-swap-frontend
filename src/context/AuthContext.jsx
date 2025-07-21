import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function checks if the user is already logged in (e.g., from a previous session)
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.log('No user logged in or token is invalid');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed', error);
      // Re-throw the error so the component can handle it (e.g., show an error message)
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Assuming your register endpoint logs the user in automatically
      const response = await api.post('/auth/register', userData);
      // Your backend register might or might not log the user in.
      // If it does, you can set the user here. For now, we'll assume it doesn't.
      console.log('Registration successful', response.data);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};