'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return false;
      }

      // Try to verify token with backend
      try {
        const response = await fetch('http://localhost:3001/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          return true;
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return false;
        }
      } catch (fetchError) {
        // Backend is not available, but we have a token
        // For development purposes, assume token is valid if it exists
        console.warn('Backend not available, using token-based auth:', fetchError);
        
        // Generate a mock JWT token for development if none exists
        if (!accessToken) {
          const mockToken = 'dev-mock-jwt-token-' + Date.now();
          localStorage.setItem('accessToken', mockToken);
          localStorage.setItem('userEmail', 'dev@example.com');
          localStorage.setItem('userName', 'Développeur');
        }
        
        // Create a mock user from localStorage or use default
        const mockUser: User = {
          id: 'dev-user',
          email: localStorage.getItem('userEmail') || 'dev@example.com',
          name: localStorage.getItem('userName') || 'Développeur'
        };
        setUser(mockUser);
        return true;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name || '');
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      if (isPublicRoute) {
        // If we're on a public route, just check if user is already authenticated
        // If they are, we might want to redirect them to dashboard
        const isAuth = await checkAuth();
        if (isAuth && pathname === '/login') {
          router.push('/dashboard');
        }
        setIsLoading(false);
        return;
      }

      // For protected routes, check authentication
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/login');
      }
      setIsLoading(false);
    };

    initAuth();
  }, [pathname, isPublicRoute, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
