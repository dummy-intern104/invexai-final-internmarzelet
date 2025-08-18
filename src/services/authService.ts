
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * AuthService handles all authentication-related functionality.
 * It provides methods for login, signup, logout, and checking auth state.
 */
export class AuthService {
  /**
   * Signs in a user with email and password
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        return { user: null, error };
      }
      
      console.log("Sign in successful:", data);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Sign in exception:", error);
      return { user: null, error };
    }
  }

  /**
   * Creates a new user account
   */
  static async signUp(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      console.log("Attempting to sign up with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error("Sign up error:", error);
        return { user: null, error };
      }
      
      console.log("Sign up successful:", data);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Sign up exception:", error);
      return { user: null, error };
    }
  }

  /**
   * Signs out the current user
   */
  static async signOut(): Promise<{ error: Error | null }> {
    try {
      console.log("Signing out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        return { error };
      }
      
      console.log("Sign out successful");
      return { error: null };
    } catch (error: any) {
      console.error("Sign out exception:", error);
      return { error };
    }
  }

  /**
   * Gets the current user session
   */
  static async getSession(): Promise<{ session: Session | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Get session error:", error);
        return { session: null, error };
      }
      
      return { session: data.session, error: null };
    } catch (error: any) {
      console.error("Get session exception:", error);
      return { session: null, error };
    }
  }

  /**
   * Sets up an auth state change listener
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      callback(session?.user ?? null);
    });
    
    return data.subscription;
  }
}

export default AuthService;
