
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useAppStore from '@/store/appStore';

export interface Supplier {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gst: string;
  created_at?: string;
  updated_at?: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAppStore();

  // Load suppliers from Supabase
  const loadSuppliers = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Cast userData to any to access suppliers field until types are updated
      const userDataWithSuppliers = userData as any;
      if (userDataWithSuppliers?.suppliers) {
        setSuppliers(userDataWithSuppliers.suppliers as Supplier[]);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  // Save suppliers to Supabase
  const saveSuppliers = async (updatedSuppliers: Supplier[]) => {
    if (!currentUser?.id) return;

    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: currentUser.id,
          suppliers: updatedSuppliers as any,
          updated_at: new Date().toISOString()
        } as any, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving suppliers:', error);
      toast.error('Failed to save suppliers');
    }
  };

  // Add a new supplier
  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString(),
      user_id: currentUser?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedSuppliers = [newSupplier, ...suppliers];
    setSuppliers(updatedSuppliers);
    await saveSuppliers(updatedSuppliers);
    return newSupplier;
  };

  // Update supplier
  const updateSupplier = async (supplierId: string, updates: Partial<Supplier>) => {
    const updatedSuppliers = suppliers.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, ...updates, updated_at: new Date().toISOString() }
        : supplier
    );
    setSuppliers(updatedSuppliers);
    await saveSuppliers(updatedSuppliers);
  };

  // Delete supplier
  const deleteSupplier = async (supplierId: string) => {
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== supplierId);
    setSuppliers(updatedSuppliers);
    await saveSuppliers(updatedSuppliers);
  };

  useEffect(() => {
    loadSuppliers();
  }, [currentUser?.id]);

  return {
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    loadSuppliers
  };
};
