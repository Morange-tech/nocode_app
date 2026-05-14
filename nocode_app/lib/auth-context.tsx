'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { insforgeClient } from '@/lib/insforge-client';

export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapUser = (rawUser: any): User | null => {
    if (!rawUser?.id) return null;

    return {
      id: rawUser.id,
      email: rawUser.email || '',
      created_at: rawUser.created_at,
      user_metadata: rawUser.user_metadata || rawUser.metadata,
    };
  };

  const refreshUser = async () => {
    try {
      const response = await insforgeClient.auth.getCurrentUser();

      // Insforge likely returns { data, error } or direct user object
      const rawUser = response?.data?.user || response?.user || response?.data || response;
      setUser(mapUser(rawUser));
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // TODO: Add real-time auth listener if Insforge supports it (recommended)
    // Example (Supabase-style):
    // const { data: listener } = insforgeClient.auth.onAuthStateChange((event, session) => {
    //   setUser(mapUser(session?.user));
    //   setIsLoading(false);
    // });
    // return () => listener?.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await insforgeClient.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}