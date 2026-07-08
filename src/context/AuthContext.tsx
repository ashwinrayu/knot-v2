import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, program: string) => Promise<User>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const savedUser = localStorage.getItem('knot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lowerEmail = email.toLowerCase();
        let loggedUser: User | null = null;

        if (lowerEmail === 'student@knot.edu') {
          loggedUser = {
            id: 'demo_stud',
            name: 'Alex Johnson',
            email: 'student@knot.edu',
            role: 'student',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&q=80',
            program: 'B.S. in Computer Science'
          };
        } else if (lowerEmail === 'staff@knot.edu') {
          loggedUser = {
            id: 'u_1',
            name: 'Dr. Evelyn Martinez',
            email: 'staff@knot.edu',
            role: 'staff',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80'
          };
        } else if (lowerEmail === 'sysadmin@knot.edu') {
          loggedUser = {
            id: 'demo_sys',
            name: 'Admin Owner',
            email: 'sysadmin@knot.edu',
            role: 'sysadmin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&q=80'
          };
        }

        if (loggedUser) {
          setUser(loggedUser);
          localStorage.setItem('knot_user', JSON.stringify(loggedUser));
          resolve(loggedUser);
        } else {
          // Fallback dynamic login as student for testing convenience
          const customUser: User = {
            id: `usr_${Date.now()}`,
            name: email.split('@')[0],
            email: email,
            role: email.includes('admin') ? 'sysadmin' : email.includes('staff') ? 'staff' : 'student',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&q=80'
          };
          setUser(customUser);
          localStorage.setItem('knot_user', JSON.stringify(customUser));
          resolve(customUser);
        }
      }, 500);
    });
  };

  const register = async (name: string, email: string, program: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name,
          email,
          role: 'student',
          program,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&q=80'
        };
        setUser(newUser);
        localStorage.setItem('knot_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('knot_user');
  };

  const verifyEmail = async (_code: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 400));
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 400));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
