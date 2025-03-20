import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest } from '@/utils/api';

type User = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiRequest<User>('auth/me', 'GET');
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest<User>('auth/login', 'POST', { email, password });
      if (response) {
        setUser(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Hàm đăng xuất
  const logout = async (): Promise<void> => {
    try {
      await apiRequest('auth/logout', 'POST');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Hàm đăng ký
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest<User>('auth/register', 'POST', { username, email, password });
      if (response) {
        setUser(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);