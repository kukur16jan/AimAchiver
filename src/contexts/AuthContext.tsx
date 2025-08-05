import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  totalTasks: number;
  completedTasks: number;
  badges: string[];
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  loginWithGoogle: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('aimAchiever_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);


  // Normal login
  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    if (!emailOrUsername || !password) {
      console.error('Missing username or email and password');
      return false;
    }
    setLoading(true);
    try {
      const res = await fetch('https://aim-achiever-backend.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: emailOrUsername, password })
      });
      const data = await res.json();
      if (res.ok && data.message === 'Login successful') {
        const userObj = {
          id: data.user?.id || '',
          email: data.user?.email || '',
          name: data.user?.username || '',
          avatar: '',
          level: 1,
          xp: 0,
          streak: 0,
          totalTasks: 0,
          completedTasks: 0,
          badges: [],
          joinDate: ''
        };
        setUser(userObj);
        localStorage.setItem('aimAchiever_user', JSON.stringify(userObj));
        setLoading(false);
        return true;
      }
      if (data.error) {
        console.error(data.error);
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      return false;
    }
  };

  // Google login handler
  const loginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    try {
      // Try to get user info from backend (after Google OAuth)
      const res = await fetch('https://aim-achiever-backend.vercel.app/auth/user', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const userObj = {
          id: data.user._id || data.user.id || '',
          email: data.user.email || '',
          name: data.user.name || data.user.username || '',
          avatar: '',
          level: 1,
          xp: 0,
          streak: 0,
          totalTasks: 0,
          completedTasks: 0,
          badges: [],
          joinDate: ''
        };
        setUser(userObj);
        localStorage.setItem('aimAchiever_user', JSON.stringify(userObj));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Google login error:', err);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    setLoading(true);
    try {
      console.log('Registering user:', email);
      const res = await fetch('https://aim-achiever-backend.vercel.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        const userObj = {
          id: data.user?.id || '',
          email,
          name,
          avatar: '',
          level: 1,
          xp: 0,
          streak: 0,
          totalTasks: 0,
          completedTasks: 0,
          badges: ['Welcome'],
          joinDate: new Date().toISOString()
        };
        setUser(userObj);
        localStorage.setItem('aimAchiever_user', JSON.stringify(userObj));
        console.log('Registration successful');
        setLoading(false);
        return null;
      }
      if (data.error) {
        console.error('Registration error:', data.error);
        setLoading(false);
        return data.error;
      }
      setLoading(false);
      return 'Registration failed. Please try again.';
    } catch (err) {
      console.error('Registration error from catch:', err);
      setLoading(false);
      return 'Registration error. Please try again.';
    }
  };

  const logout = async () => {
    // Always clear frontend state
    setUser(null);
    localStorage.removeItem('aimAchiever_user');
    localStorage.removeItem('aimAchiever_ai_chat_history');
    // Also call backend logout for Google or session-based logins
    try {
      await fetch('https://aim-achiever-backend.vercel.app/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch {
      // Ignore errors, just ensure frontend is cleared
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // TODO: Add API call to update user in backend
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};