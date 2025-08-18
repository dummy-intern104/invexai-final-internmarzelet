
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Track active subscriptions to prevent duplicates
let activeSubscriptions = new Set<string>();

// Enhanced logging function
const logDataSyncEvent = (event: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[DATA-SYNC ${timestamp}] ${event}`, details || '');
};

// Enhanced conflict detection and resolution
interface DataConflict {
  local: any;
  remote: any;
  field: string;
}

/**
 * Detect conflicts between local and remote data
 */
const detectConflicts = (localData: any, remoteData: any): DataConflict[] => {
  const conflicts: DataConflict[] = [];
  
  if (!localData || !remoteData) {
    return conflicts;
  }
  
  // Compare each data type
  ['products', 'sales', 'clients', 'payments'].forEach(field => {
    const localArray = localData[field] || [];
    const remoteArray = remoteData[field] || [];
    
    if (JSON.stringify(localArray) !== JSON.stringify(remoteArray)) {
      conflicts.push({
        local: localArray,
        remote: remoteArray,
        field
      });
    }
  });
  
  return conflicts;
};

/**
 * Resolve conflicts with user preference for local data
 */
const resolveConflicts = (conflicts: DataConflict[]): any => {
  const resolved: any = {};
  
  conflicts.forEach(conflict => {
    // For now, prefer local data with more items (user has been working)
    const localCount = Array.isArray(conflict.local) ? conflict.local.length : 0;
    const remoteCount = Array.isArray(conflict.remote) ? conflict.remote.length : 0;
    
    if (localCount >= remoteCount) {
      resolved[conflict.field] = conflict.local;
      logDataSyncEvent(`Resolved conflict for ${conflict.field} - keeping local data`, {
        localCount,
        remoteCount
      });
    } else {
      resolved[conflict.field] = conflict.remote;
      logDataSyncEvent(`Resolved conflict for ${conflict.field} - using remote data`, {
        localCount,
        remoteCount
      });
    }
  });
  
  return resolved;
};

export async function saveUserDataToSupabase(userId: string, state: any) {
  logDataSyncEvent("Starting save to Supabase", { userId });
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    logDataSyncEvent("User not authenticated or ID mismatch", { 
      hasUser: !!user, 
      requestedUserId: userId, 
      actualUserId: user?.id 
    });
    toast.error("Authentication required to save data");
    throw new Error("Authentication required");
  }
  
  try {
    // Create backup before saving
    const backupData = {
      products: [...(state.products || [])],
      sales: [...(state.sales || [])],
      clients: [...(state.clients || [])],
      payments: [...(state.payments || [])],
      timestamp: Date.now()
    };
    
    // Save backup to sessionStorage for recovery
    try {
      sessionStorage.setItem('invex_data_backup', JSON.stringify(backupData));
      logDataSyncEvent("Created backup in sessionStorage");
    } catch (e) {
      logDataSyncEvent("Could not save backup to sessionStorage", { error: e.message });
    }
    
    // Get current data to save
    const userData = {
      user_id: userId,
      products: state.products || [],
      sales: state.sales || [],
      clients: state.clients || [],
      payments: state.payments || [],
      updated_at: new Date().toISOString()
    };
    
    logDataSyncEvent("Saving data to Supabase", {
      productsCount: userData.products.length,
      salesCount: userData.sales.length,
      clientsCount: userData.clients.length,
      paymentsCount: userData.payments.length
    });
    
    const { error } = await supabase
      .from('user_data')
      .upsert(userData as any, { 
        onConflict: 'user_id',
        ignoreDuplicates: false
      });
    
    if (error) {
      logDataSyncEvent('Error saving data to Supabase', { error: error.message });
      
      // Try to restore from backup
      const backup = sessionStorage.getItem('invex_data_backup');
      if (backup) {
        logDataSyncEvent("Data save failed, backup available for recovery");
      }
      
      toast.error("Failed to save your changes - data backed up locally");
      throw error;
    } else {
      logDataSyncEvent("Data successfully saved to Supabase");
      // Clear backup after successful save
      sessionStorage.removeItem('invex_data_backup');
      
      // Show success toast
      toast.success("Changes saved", {
        id: "data-saved",
        duration: 2000
      });
    }
  } catch (error) {
    logDataSyncEvent('Error saving to Supabase', { error: error.message });
    toast.error("Error saving your changes - data backed up locally");
    throw error;
  }
}

export async function fetchUserDataFromSupabase(userId: string, options: { skipConflictCheck?: boolean } = {}) {
  logDataSyncEvent("Starting data fetch from Supabase", { userId, options });
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    logDataSyncEvent("User not authenticated or ID mismatch for fetch", {
      hasUser: !!user,
      requestedUserId: userId,
      actualUserId: user?.id
    });
    if (!options.skipConflictCheck) {
      toast.error("Authentication required to load data");
    }
    throw new Error("Authentication required");
  }
  
  try {
    // Check for local backup first
    let localBackup = null;
    try {
      const backup = sessionStorage.getItem('invex_data_backup');
      if (backup) {
        localBackup = JSON.parse(backup);
        logDataSyncEvent("Found local backup data", {
          backupAge: Date.now() - localBackup.timestamp
        });
      }
    } catch (e) {
      logDataSyncEvent("Could not parse local backup", { error: e.message });
    }
    
    // Fetch user data from the user_data table
    const { data: userData, error: userDataError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Fetch product expiry data from the product_expiry table
    const { data: expiryData, error: expiryError } = await supabase
      .from('product_expiry')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true });
    
    if (userDataError && userDataError.code !== 'PGRST116') {
      logDataSyncEvent('Error fetching user data', { error: userDataError.message });
      if (!options.skipConflictCheck) {
        toast.error("Failed to load your data");
      }
      throw userDataError;
    }
    
    if (expiryError) {
      logDataSyncEvent('Error fetching expiry data', { error: expiryError.message });
      // Don't throw on expiry error, just log and continue with empty array
    }
    
    const productExpiries = expiryData || [];
    logDataSyncEvent("Fetched expiry data", { expiryCount: productExpiries.length });
    
    if (!userData) {
      logDataSyncEvent("No existing user data found");
      
      // If we have local backup, offer to restore it
      if (localBackup && !options.skipConflictCheck) {
        const shouldRestore = confirm(
          "No data found on server, but you have local backup data. Would you like to restore it?"
        );
        
        if (shouldRestore) {
          logDataSyncEvent("Restoring from local backup");
          return {
            products: localBackup.products || [],
            sales: localBackup.sales || [],
            clients: localBackup.clients || [],
            payments: localBackup.payments || [],
            productExpiries
          };
        }
      }
      
      return {
        products: [],
        sales: [],
        clients: [],
        payments: [],
        productExpiries
      };
    } 
    
    logDataSyncEvent('Found existing data for user', {
      productsCount: Array.isArray(userData.products) ? userData.products.length : 0,
      salesCount: Array.isArray(userData.sales) ? userData.sales.length : 0,
      clientsCount: Array.isArray(userData.clients) ? userData.clients.length : 0,
      paymentsCount: Array.isArray(userData.payments) ? userData.payments.length : 0,
      expiryCount: productExpiries.length
    });
    
    // Check for conflicts with local backup
    if (localBackup && !options.skipConflictCheck) {
      const conflicts = detectConflicts(localBackup, userData);
      
      if (conflicts.length > 0) {
        logDataSyncEvent("Detected conflicts between local and remote data", {
          conflictCount: conflicts.length
        });
        
        const shouldResolveConflicts = confirm(
          `Found differences between your local data and server data. ` +
          `Would you like to automatically resolve conflicts? ` +
          `(Your local changes will be preserved where possible)`
        );
        
        if (shouldResolveConflicts) {
          const resolvedData = resolveConflicts(conflicts);
          
          // Merge resolved data with remote data
          const mergedData = {
            products: resolvedData.products || userData.products || [],
            sales: resolvedData.sales || userData.sales || [],
            clients: resolvedData.clients || userData.clients || [],
            payments: resolvedData.payments || userData.payments || [],
            productExpiries
          };
          
          toast.success("Data conflicts resolved - local changes preserved");
          return mergedData;
        }
      }
    }
    
    // Clear backup after successful sync
    if (localBackup) {
      sessionStorage.removeItem('invex_data_backup');
      logDataSyncEvent("Cleared local backup after successful sync");
    }
    
    return {
      products: userData.products || [],
      sales: userData.sales || [],
      clients: userData.clients || [],
      payments: userData.payments || [],
      productExpiries
    };
  } catch (error) {
    logDataSyncEvent('Error fetching data from Supabase', { error: error.message });
    if (!options.skipConflictCheck) {
      toast.error("Error loading your data");
    }
    throw error;
  }
}

export async function createEmptyUserData(userId: string) {
  logDataSyncEvent("Creating empty user data record", { userId });
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    logDataSyncEvent("User not authenticated or ID mismatch for create", {
      hasUser: !!user,
      requestedUserId: userId,
      actualUserId: user?.id
    });
    toast.error("Authentication required to initialize data");
    throw new Error("Authentication required");
  }
  
  try {
    const userData = {
      user_id: userId,
      products: [],
      sales: [],
      clients: [],
      payments: []
    };
    
    const { error } = await supabase
      .from('user_data')
      .insert(userData as any);
      
    if (error) {
      logDataSyncEvent('Error inserting empty data to Supabase', { error: error.message });
      toast.error("Failed to initialize your data");
      throw error;
    } else {
      logDataSyncEvent("Successfully created empty data record in Supabase");
      return {
        products: [],
        sales: [],
        clients: [],
        payments: [],
        productExpiries: []
      };
    }
  } catch (error) {
    logDataSyncEvent('Error creating empty user data', { error: error.message });
    toast.error("Failed to initialize your data");
    throw error;
  }
}

export function setupRealtimeSubscription(userId: string, dataUpdateCallback: (data: any) => void) {
  const subscriptionKey = `user_data_${userId}`;
  
  // Check if subscription already exists
  if (activeSubscriptions.has(subscriptionKey)) {
    logDataSyncEvent("Subscription already exists for user", { userId });
    return () => {
      logDataSyncEvent("Cleanup called for existing subscription");
      activeSubscriptions.delete(subscriptionKey);
      supabase.removeAllChannels();
    };
  }
  
  logDataSyncEvent("Setting up NEW realtime subscription for user", { userId });
  
  // Clean up any existing channels to prevent duplicate subscriptions
  try {
    supabase.removeAllChannels();
    activeSubscriptions.clear(); // Clear tracking as well
    logDataSyncEvent("Removed all existing channels before setting up new subscription");
  } catch (e) {
    logDataSyncEvent("Error removing existing channels", { error: e.message });
  }
  
  // Mark this subscription as active
  activeSubscriptions.add(subscriptionKey);
  
  const channel = supabase
    .channel(`user_data_changes_${userId}`) // Make channel name unique per user
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_data',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        logDataSyncEvent("Received realtime update", {
          userId,
          updateTime: payload.new?.updated_at,
          hasNewData: !!payload.new
        });
        
        if (payload.new) {
          // Enhanced time checking for realtime updates
          const updateTime = new Date(payload.new.updated_at).getTime();
          const now = Date.now();
          const isRecentUpdate = (now - updateTime) < 300000; // Within last 5 minutes
          
          if (isRecentUpdate) {
            logDataSyncEvent("Processing update from another device", {
              updateAge: Math.round((now - updateTime) / 1000)
            });
            
            // The callback will update the store with the new data
            dataUpdateCallback(payload.new);
          } else {
            logDataSyncEvent("Ignoring stale update", {
              updateTime: new Date(updateTime).toISOString(),
              ageMinutes: Math.round((now - updateTime) / 60000)
            });
          }
        }
      }
    )
    .subscribe((status) => {
      logDataSyncEvent("Realtime subscription status", { status, userId });
      if (status === "SUBSCRIBED") {
        logDataSyncEvent("Successfully subscribed to realtime updates", { userId });
      } else if (status === "CHANNEL_ERROR") {
        logDataSyncEvent("Error subscribing to realtime updates");
        // Mark subscription as failed
        activeSubscriptions.delete(subscriptionKey);
        // Enhanced retry logic with exponential backoff
        const retryDelay = Math.min(30000, 5000 * Math.pow(2, activeSubscriptions.size)); // Max 30 seconds
        setTimeout(() => {
          logDataSyncEvent("Attempting to resubscribe to realtime updates", {
            delaySeconds: retryDelay / 1000
          });
          if (!activeSubscriptions.has(subscriptionKey)) {
            setupRealtimeSubscription(userId, dataUpdateCallback);
          }
        }, retryDelay);
      } else if (status === "CLOSED") {
        logDataSyncEvent("Subscription closed for user", { userId });
        activeSubscriptions.delete(subscriptionKey);
      }
    });
  
  // Return enhanced cleanup function
  return () => {
    logDataSyncEvent("Removing realtime subscription for user", { userId });
    activeSubscriptions.delete(subscriptionKey);
    supabase.removeChannel(channel);
  };
}
