import { toast } from "sonner";
import { AppState } from './types';

// Variable to store the timestamp of the last update from this device
let lastUpdateTimestamp = Date.now();

// Flag to control automatic syncing - ENABLED by default
let autoSyncEnabled = true;

// Flag to track if we're currently processing a realtime update
let isProcessingRealtimeUpdate = false;

// Mutex to prevent concurrent state updates
let updateMutex = false;

// Tab visibility tracking
let isTabVisible = true;
let lastTabVisibilityChange = Date.now();

// User activity tracking
let lastUserActivity = Date.now();
let userActivityTimeout: NodeJS.Timeout | null = null;

// Local data backup for conflict resolution
let localDataBackup: any = null;

// Enhanced logging function
const logDataEvent = (event: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[DATA-SYNC ${timestamp}] ${event}`, details || '');
};

/**
 * Initialize tab visibility tracking
 */
const initializeTabVisibility = () => {
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      lastTabVisibilityChange = Date.now();
      logDataEvent("Tab visibility changed", { isVisible: isTabVisible });
    });
  }
};

/**
 * Track user activity to prevent sync during active use
 */
const trackUserActivity = () => {
  lastUserActivity = Date.now();
  
  if (userActivityTimeout) {
    clearTimeout(userActivityTimeout);
  }
  
  // Clear activity flag after 30 seconds of inactivity
  userActivityTimeout = setTimeout(() => {
    logDataEvent("User activity timeout reached");
  }, 30000);
};

// Initialize tracking when module loads
if (typeof document !== 'undefined') {
  initializeTabVisibility();
  
  // Track user interactions
  ['click', 'keydown', 'scroll', 'mousemove'].forEach(eventType => {
    document.addEventListener(eventType, trackUserActivity, { passive: true });
  });
}

/**
 * Check if we should ignore updates based on various factors
 */
const shouldIgnoreUpdate = (userData: any): boolean => {
  const currentTime = Date.now();
  
  // Ignore if tab was recently switched (within 10 seconds - reduced from 30)
  if (currentTime - lastTabVisibilityChange < 10000) {
    logDataEvent("Ignoring update - recent tab visibility change", {
      timeSinceChange: currentTime - lastTabVisibilityChange
    });
    return true;
  }
  
  // Ignore if this is a recent update from this device (reduced to 15 seconds)
  if (currentTime - lastUpdateTimestamp < 15000) {
    logDataEvent("Ignoring recent update from this device", {
      timeSinceLastUpdate: currentTime - lastUpdateTimestamp
    });
    return true;
  }
  
  // Ignore if user was recently active (within 2 seconds - reduced from 5)
  if (currentTime - lastUserActivity < 2000) {
    logDataEvent("Ignoring update - recent user activity", {
      timeSinceActivity: currentTime - lastUserActivity
    });
    return true;
  }
  
  return false;
};

/**
 * Create backup of local data before sync
 */
const createLocalDataBackup = (currentState: AppState): void => {
  localDataBackup = {
    products: [...(currentState.products || [])],
    sales: [...(currentState.sales || [])],
    clients: [...(currentState.clients || [])],
    payments: [...(currentState.payments || [])],
    timestamp: Date.now()
  };
  logDataEvent("Created local data backup", {
    productsCount: localDataBackup.products.length,
    salesCount: localDataBackup.sales.length,
    clientsCount: localDataBackup.clients.length,
    paymentsCount: localDataBackup.payments.length
  });
};

/**
 * Intelligent merge of local and remote data
 */
const intelligentMerge = (localData: any, remoteData: any): any => {
  if (!localData || !remoteData) {
    logDataEvent("Merge: using available data", {
      hasLocal: !!localData,
      hasRemote: !!remoteData
    });
    return remoteData || localData;
  }
  
  // For now, prefer local data if it has more recent changes
  const localTimestamp = localData.timestamp || 0;
  const remoteTimestamp = new Date(remoteData.updated_at || 0).getTime();
  
  if (localTimestamp > remoteTimestamp) {
    logDataEvent("Merge: keeping local data (more recent)", {
      localTime: new Date(localTimestamp).toISOString(),
      remoteTime: new Date(remoteTimestamp).toISOString()
    });
    return localData;
  }
  
  logDataEvent("Merge: using remote data (more recent)", {
    localTime: new Date(localTimestamp).toISOString(),
    remoteTime: new Date(remoteTimestamp).toISOString()
  });
  return remoteData;
};

/**
 * Check if data has meaningful changes
 */
const hasMeaningfulChanges = (localData: any, remoteData: any): boolean => {
  if (!localData || !remoteData) {
    return true;
  }
  
  // Compare data lengths first (quick check)
  const localCounts = {
    products: (localData.products || []).length,
    sales: (localData.sales || []).length,
    clients: (localData.clients || []).length,
    payments: (localData.payments || []).length
  };
  
  const remoteCounts = {
    products: (remoteData.products || []).length,
    sales: (remoteData.sales || []).length,
    clients: (remoteData.clients || []).length,
    payments: (remoteData.payments || []).length
  };
  
  // If counts are different, there are meaningful changes
  const hasDifferentCounts = Object.keys(localCounts).some(
    key => localCounts[key] !== remoteCounts[key]
  );
  
  if (hasDifferentCounts) {
    logDataEvent("Detected meaningful changes in data counts", {
      local: localCounts,
      remote: remoteCounts
    });
    return true;
  }
  
  return false;
};

/**
 * Configures a store for auto-saving with Supabase
 */
export function configureAutoSave(
  set: any, 
  get: any, 
  saveDataToSupabase: () => Promise<void>
) {
  // Add auto-save functionality when data changes
  const setWithAutoSave = (fn: any) => {
    // Create backup before applying changes
    const currentState = get();
    createLocalDataBackup(currentState);
    
    // Apply the state update
    set(fn);
    
    // Track this as user activity
    trackUserActivity();
    
    // Schedule a save operation if auto-sync is enabled and user is logged in
    if (autoSyncEnabled && !isProcessingRealtimeUpdate) {
      // Immediate save for critical operations (like adding clients)
      const state = get();
      if (state.currentUser && !isProcessingRealtimeUpdate) {
        logDataEvent("AUTO-SAVE: Triggering immediate auto-save after state change");
        updateLastTimestamp(); // Mark this as a local update
        saveDataToSupabase().catch(error => {
          logDataEvent("AUTO-SAVE: Error saving data", { error: error.message });
          console.error("Error auto-saving data after state change:", error);
        });
      }
    } else {
      logDataEvent("AUTO-SAVE: Skipped", {
        autoSyncEnabled,
        isProcessingRealtimeUpdate,
        hasCurrentUser: !!get().currentUser
      });
    }
  };

  return setWithAutoSave;
}

/**
 * Processes real-time updates from Supabase with enhanced conflict resolution
 */
export function processRealtimeUpdate(
  userData: any, 
  get: () => AppState, 
  set: (state: any) => void
): boolean {
  // Prevent concurrent updates
  if (updateMutex) {
    logDataEvent("Update mutex active, skipping update");
    return false;
  }

  // Check if we should ignore this update
  if (shouldIgnoreUpdate(userData)) {
    return false;
  }
  
  // Set processing flag to prevent auto-save conflicts
  isProcessingRealtimeUpdate = true;
  updateMutex = true;
  
  try {
    // Get current state and create backup
    const currentState = get();
    createLocalDataBackup(currentState);
    
    // Compare local data with received data
    const products = Array.isArray(userData.products) ? userData.products : [];
    const sales = Array.isArray(userData.sales) ? userData.sales : [];
    const clients = Array.isArray(userData.clients) ? userData.clients : [];
    const payments = Array.isArray(userData.payments) ? userData.payments : [];
    
    // Check for meaningful changes
    if (!hasMeaningfulChanges(currentState, userData)) {
      logDataEvent("No meaningful changes detected, ignoring update");
      return false;
    }
    
    // Only prompt user for significant conflicts during active use
    const isUserActive = (Date.now() - lastUserActivity) < 10000; // Reduced from 30 seconds
    const hasLocalChanges = localDataBackup && (Date.now() - localDataBackup.timestamp) < 60000; // Reduced from 5 minutes
    
    if (isUserActive && hasLocalChanges) {
      // User is actively working and has recent local changes
      logDataEvent("User is active with local changes, deferring sync");
      
      // Show a non-intrusive notification
      toast.info("Data updated on another device. Changes will sync when you're done.", {
        id: "deferred-sync",
        duration: 3000
      });
      
      return false;
    }
    
    // For background updates when user is not active, apply changes silently
    logDataEvent("Applying background sync update", {
      productsCount: products.length,
      salesCount: sales.length,
      clientsCount: clients.length,
      paymentsCount: payments.length
    });
    
    // Use intelligent merge instead of direct overwrite
    const mergedData = {
      products: intelligentMerge(currentState.products, products),
      sales: intelligentMerge(currentState.sales, sales),
      clients: intelligentMerge(currentState.clients, clients),
      payments: intelligentMerge(currentState.payments, payments)
    };
    
    // Clear processed transactions to prevent conflicts with new data
    const { clearProcessedTransactions } = get();
    if (clearProcessedTransactions) {
      clearProcessedTransactions();
    }
    
    set(mergedData);
    
    // Only show success message if there were actual meaningful changes applied
    if (JSON.stringify(mergedData) !== JSON.stringify(currentState)) {
      logDataEvent("Successfully applied realtime update");
    }
    
    return true;
  } finally {
    // Always clear the processing flags
    setTimeout(() => {
      isProcessingRealtimeUpdate = false;
      updateMutex = false;
      logDataEvent("Processing flags cleared");
    }, 500); // Reduced to 0.5 seconds for better responsiveness
  }
}

/**
 * Updates the last update timestamp to mark that we've made a local change
 */
export function updateLastTimestamp() {
  lastUpdateTimestamp = Date.now();
  logDataEvent("Updated last timestamp", { timestamp: new Date(lastUpdateTimestamp).toISOString() });
}

/**
 * Enable or disable automatic syncing
 */
export function setAutoSync(enabled: boolean) {
  autoSyncEnabled = enabled;
  logDataEvent(`Auto-sync ${enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Check if auto sync is enabled
 */
export function isAutoSyncEnabled() {
  return autoSyncEnabled;
}

/**
 * Check if currently processing realtime update
 */
export function isProcessingRealtime() {
  return isProcessingRealtimeUpdate;
}

/**
 * Get local data backup
 */
export function getLocalDataBackup() {
  return localDataBackup;
}

/**
 * Force sync local data with remote (for manual sync operations)
 */
export function forceSyncWithConfirmation(
  remoteData: any,
  get: () => AppState,
  set: (state: any) => void
): boolean {
  const currentState = get();
  createLocalDataBackup(currentState);
  
  if (hasMeaningfulChanges(currentState, remoteData)) {
    const shouldSync = confirm(
      "Your data differs from the server version. Would you like to sync with the server data? " +
      "Your local changes will be preserved where possible."
    );
    
    if (shouldSync) {
      logDataEvent("User confirmed force sync");
      return processRealtimeUpdate(remoteData, get, set);
    } else {
      logDataEvent("User cancelled force sync");
    }
  }
  
  return false;
}
