import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // If parsing fails, clear localStorage
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users and find one matching the email
      const users = await api.users.getAll();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Simulate successful login
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred during login';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      // Check if email is already in use
      const users = await api.users.getAll();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already in use');
      }

      // Create a mock user (JSONPlaceholder doesn't actually save this)
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 10, // Random ID
        name,
        username: name.split(' ')[0].toLowerCase(),
        email,
      };

      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Registration successful!');
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred during registration';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Logout function
  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('user');
    toast.success('You have been logged out');
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}