
import { AppState } from '../types';
import { toast } from "sonner";
import { saveUserDataToSupabase } from '../slices/userSlice/dataSync';
import { updateLastTimestamp } from '../realtimeSync';

// Enhanced auto-save configuration with immediate saving for critical operations
export const createDefaultAutoSave = (set: any, get: any) => {
  const immediateAutoSave = async (actionName: string) => {
    const { currentUser } = get();
    if (!currentUser) {
      console.log(`AUTO-SAVE: No current user for ${actionName}, skipping save`);
      return;
    }
    
    try {
      console.log(`AUTO-SAVE: Triggering immediate save after ${actionName}`);
      updateLastTimestamp(); // Mark this as a local update
      await saveUserDataToSupabase(currentUser.id, get());
      console.log(`AUTO-SAVE: Successfully saved after ${actionName}`);
    } catch (error) {
      console.error(`AUTO-SAVE: Error saving after ${actionName}:`, error);
      toast.error(`Failed to save ${actionName}. Please try again.`);
      throw error;
    }
  };

  return immediateAutoSave;
};

// Wrapper for store actions that need immediate saving - fixed to handle parameters
export const withImmediateSave = (set: any, get: any, actionName: string, action: (...args: any[]) => any) => {
  const immediateAutoSave = createDefaultAutoSave(set, get);
  
  return async (...args: any[]) => {
    try {
      // Execute the action with its parameters
      const result = action(...args);
      
      // Immediately save to Supabase
      await immediateAutoSave(actionName);
      
      return result;
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      toast.error(`Failed to ${actionName}. Please try again.`);
      throw error;
    }
  };
};
