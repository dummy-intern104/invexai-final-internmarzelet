
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import AuthService from '@/services/authService';
import useAppStore from '@/store/appStore';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authChecked: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthContext() {
  return useAuth();
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const { 
    setupRealtimeUpdates, 
    syncDataWithSupabase, 
    setCurrentUser,
    saveDataToSupabase // Add this to save data before clearing
  } = useAppStore();

  // Enhanced logging for auth events
  const logAuthEvent = (event: string, details?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[AUTH ${timestamp}] ${event}`, details || '');
  };

  const clearUserData = async () => {
    const currentState = useAppStore.getState();
    
    // Only save if we have a current user and some data to save
    if (currentState.currentUser && (
      (currentState.products || []).length > 0 ||
      (currentState.sales || []).length > 0 ||
      (currentState.clients || []).length > 0 ||
      (currentState.payments || []).length > 0
    )) {
      try {
        logAuthEvent('Saving data before clearing user data');
        await saveDataToSupabase();
        logAuthEvent('Data saved successfully before clearing');
      } catch (error) {
        logAuthEvent('Error saving data before clearing', { error: error.message });
        console.error("Error saving data before clearing:", error);
      }
    }
    
    logAuthEvent('Clearing all user data');
    // Clear current user in store
    setCurrentUser(null);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        logAuthEvent('Initializing auth');
        const { session: initialSession } = await AuthService.getSession();
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          
          // Update store's currentUser
          if (initialSession?.user) {
            logAuthEvent('User authenticated, updating store currentUser', { 
              userId: initialSession.user.id 
            });
            setCurrentUser(initialSession.user);
            
            // Delay data sync to prevent race conditions
            setTimeout(async () => {
              try {
                await syncDataWithSupabase();
                setupRealtimeUpdates(initialSession.user.id);
              } catch (error) {
                logAuthEvent('Error syncing data on init', { error: error.message });
              }
            }, 100);
          } else {
            setCurrentUser(null);
            logAuthEvent('No authenticated user found');
          }
        }
      } catch (error) {
        logAuthEvent('Error getting initial session', { error: error.message });
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
          logAuthEvent('Auth initialization complete');
        }
      }
    };

    initializeAuth();

    const subscription = AuthService.onAuthStateChange((user) => {
      logAuthEvent('Auth state change detected', { userId: user?.id || 'null' });
      
      if (isMounted) {
        const previousUserId = session?.user?.id;
        const newUserId = user?.id;
        
        setUser(user);
        setSession(user ? { user } as Session : null);
        
        // Update store's currentUser
        setCurrentUser(user);
        
        if (user && newUserId !== previousUserId) {
          logAuthEvent('New user signed in, syncing data', { 
            previousUserId, 
            newUserId 
          });
          
          // Only clear data if it's a different user
          if (previousUserId && previousUserId !== newUserId) {
            clearUserData();
          }
          
          setCurrentUser(user); // Set again after potential clearing
          
          setTimeout(async () => {
            try {
              await syncDataWithSupabase();
              setupRealtimeUpdates(user.id);
            } catch (error) {
              logAuthEvent('Error syncing data for new user', { error: error.message });
            }
          }, 100);
        } else if (!user) {
          logAuthEvent('User signed out, clearing data');
          clearUserData();
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setupRealtimeUpdates, syncDataWithSupabase, setCurrentUser, saveDataToSupabase]);

  const signOut = async () => {
    try {
      logAuthEvent('Sign out initiated');
      await clearUserData();
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      logAuthEvent('Sign out completed');
    } catch (error) {
      logAuthEvent('Error signing out', { error: error.message });
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    authChecked,
    isLoading: loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
