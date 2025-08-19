
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const createSupabaseClientOperations = (set: any, get: any) => ({
  setClients: (clients: any[]) => {
    set({ clients });
  },

  addClient: async (clientData: any) => {
    try {
      const newClient = await supabaseService.clients.create(clientData);
      set((state: any) => ({
        clients: [newClient, ...state.clients]
      }));
      toast.success('Client added successfully');
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      throw error;
    }
  },

  updateClient: async (clientId: string, updatedData: any) => {
    try {
      const updatedClient = await supabaseService.clients.update(clientId, updatedData);
      set((state: any) => ({
        clients: state.clients.map((client: any) =>
          client.id === clientId ? updatedClient : client
        )
      }));
      toast.success('Client updated successfully');
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  },

  deleteClient: async (clientId: string) => {
    try {
      await supabaseService.clients.delete(clientId);
      set((state: any) => ({
        clients: state.clients.filter((client: any) => client.id !== clientId)
      }));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      throw error;
    }
  },

  removeClient: async (clientId: string) => {
    // Alias for deleteClient for compatibility
    return get().deleteClient(clientId);
  },

  loadClients: async () => {
    try {
      const clients = await supabaseService.clients.getAll();
      set({ clients });
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    }
  },

  updateClientPurchase: async (clientName: string, amount: number, productName: string, quantity: number) => {
    try {
      // This would typically update client purchase history
      // For now, we'll just log it as it requires more complex logic
      console.log('Client purchase update:', { clientName, amount, productName, quantity });
    } catch (error) {
      console.error('Error updating client purchase:', error);
    }
  }
});
