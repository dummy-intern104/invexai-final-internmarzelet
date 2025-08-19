
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabaseClient {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gst_number?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseClients = () => {
  const [clients, setClients] = useState<SupabaseClient[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.clients.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<SupabaseClient, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newClient = await supabaseService.clients.create(clientData);
      setClients(prev => [newClient, ...prev]);
      toast.success('Client created successfully');
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
      throw error;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<SupabaseClient>) => {
    try {
      const updatedClient = await supabaseService.clients.update(clientId, updates);
      setClients(prev => prev.map(client => 
        client.id === clientId ? updatedClient : client
      ));
      toast.success('Client updated successfully');
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      await supabaseService.clients.delete(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      throw error;
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    loadClients
  };
};
