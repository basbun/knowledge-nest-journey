
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  isLoading: boolean; // Added to track initial auth check
};

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  isDemoMode: false,
  setIsDemoMode: () => {},
  isLoading: true // Default to loading state
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    console.log('Initializing auth state...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user logs in, ensure demo mode is turned off
        if (session) {
          console.log('User logged in, disabling demo mode');
          setIsDemoMode(false);
        }
        
        // Auth state is resolved
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user has an active session, ensure demo mode is off
      if (session) {
        setIsDemoMode(false);
      }
      
      // Initial auth check complete
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isDemoMode, setIsDemoMode, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
