import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  activeRole: UserRole;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gms_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('admin');

  const loginWithCreds = async (username: string, pass: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.login(username, pass);
      if (res.success && res.token) {
        localStorage.setItem('gms_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setActiveRole(res.user.role);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (role: UserRole) => {
    setActiveRole(role);
  };

  const logout = () => {
    localStorage.removeItem('gms_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('gms_token');
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            setActiveRole(res.user.role);
          } else {
            localStorage.removeItem('gms_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('gms_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        activeRole,
        login: loginWithCreds,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
