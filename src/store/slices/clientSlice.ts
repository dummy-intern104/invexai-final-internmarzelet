

// Re-export from the new modular structure for backward compatibility
export { createClientSlice, useClientStore } from './client/clientSlice';
export type { ClientState } from './client';

// Import useClientStore to use as default export
import { useClientStore } from './client/clientSlice';
export default useClientStore;

