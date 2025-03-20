import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest } from '@/utils/api';

type User = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

type LoginResponse = {
  user: User;
  token: string;
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
        // Kiểm tra xem có user trong localStorage không
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          // Nếu có, set user từ localStorage
          setUser(JSON.parse(storedUser));
          
          // Xác thực token bằng cách gọi API me
          const userData = await apiRequest<User>('auth/me', 'GET');
          if (userData) {
            // Cập nhật user nếu API trả về thành công
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Nếu API trả về lỗi, xóa thông tin đăng nhập
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Xóa thông tin đăng nhập nếu có lỗi
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest<LoginResponse>('auth/login', 'POST', { email, password });
      if (response && response.token) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa thông tin đăng nhập khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  // Hàm đăng ký
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest<LoginResponse>('auth/register', 'POST', { username, email, password });
      if (response && response.token) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
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