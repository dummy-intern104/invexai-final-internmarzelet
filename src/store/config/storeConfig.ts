
import { AppState } from '../types';
import { toast } from "sonner";
import { saveUserDataToSupabase, setupRealtimeSubscription } from '../slices/userSlice/dataSync';
import { configureAutoSave, processRealtimeUpdate, updateLastTimestamp } from '../realtimeSync';

// Track user activity to prevent unnecessary syncs during active use
let lastUserActivity = Date.now();
let userActivityTimer: NodeJS.Timeout | null = null;

// Enhanced activity tracking
const trackActivity = () => {
  lastUserActivity = Date.now();
  
  if (userActivityTimer) {
    clearTimeout(userActivityTimer);
  }
  
  // Reset activity flag after 30 seconds of inactivity
  userActivityTimer = setTimeout(() => {
    console.log("STORE: User activity timeout reached");
  }, 30000);
};

// Set up activity tracking if in browser environment
if (typeof window !== 'undefined') {
  ['click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    window.addEventListener(event, trackActivity, { passive: true });
  });
}

export const createStoreConfiguration = (set: any, get: any) => {
  // Create a function that will be used to save data to Supabase
  const saveDataToSupabase = async () => {
    const { currentUser } = get();
    if (!currentUser) {
      console.log("STORE: No current user, skipping data save");
      return;
    }
    
    try {
      console.log("STORE: Saving data to Supabase from store");
      updateLastTimestamp(); // Mark this as a local update
      await saveUserDataToSupabase(currentUser.id, get());
    } catch (error) {
      console.error('STORE: Error in saveDataToSupabase:', error);
      throw error;
    }
  };

  // Configure auto-saving functionality with enhanced tracking
  const setWithAutoSave = configureAutoSave(set, get, saveDataToSupabase);

  // Variable to store unsubscribe function for realtime updates
  let realtimeUnsubscribe: (() => void) | null = null;

  // Enhanced realtime updates with better filtering
  const setupRealtimeUpdates = (userId: string): (() => void) => {
    console.log("STORE: Setting up realtime updates for user:", userId);
    
    // Clean up any existing subscription
    if (realtimeUnsubscribe) {
      console.log("STORE: Cleaning up existing subscription");
      realtimeUnsubscribe();
      realtimeUnsubscribe = null;
    }
    
    // Set up new subscription with enhanced filtering
    realtimeUnsubscribe = setupRealtimeSubscription(userId, (userData) => {
      console.log("STORE: Receiving realtime update:", {
        productsCount: Array.isArray(userData.products) ? userData.products.length : 0,
        salesCount: Array.isArray(userData.sales) ? userData.sales.length : 0,
        clientsCount: Array.isArray(userData.clients) ? userData.clients.length : 0,
        paymentsCount: Array.isArray(userData.payments) ? userData.payments.length : 0
      });
      
      // Check if user is currently active
      const isUserActive = (Date.now() - lastUserActivity) < 30000; // 30 seconds
      
      if (isUserActive) {
        console.log("STORE: User is active, deferring realtime update");
        
        // Show a subtle notification instead of immediate sync
        toast.info("Data updated on another device", {
          id: "deferred-update",
          duration: 3000,
          description: "Changes will sync when you're done working"
        });
        
        // Set a timer to process the update when user becomes inactive
        setTimeout(() => {
          const stillActive = (Date.now() - lastUserActivity) < 30000;
          if (!stillActive) {
            console.log("STORE: User became inactive, processing deferred update");
            processRealtimeUpdate(userData, get, set);
          }
        }, 30000);
        
        return;
      }
      
      // Process the update using our utility function for inactive users
      console.log("STORE: User is inactive, processing realtime update immediately");
      processRealtimeUpdate(userData, get, set);
    });
    
    // Removed automatic data sync on setup to prevent unnecessary syncing
    
    // Always return a cleanup function, even if realtimeUnsubscribe is null
    return () => {
      console.log("STORE: Cleanup function called");
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
        realtimeUnsubscribe = null;
      }
    };
  };

  return {
    saveDataToSupabase,
    setWithAutoSave,
    setupRealtimeUpdates
  };
};
