
import { useState, useEffect } from 'react';
import { supplierService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabaseSupplier {
  id: string;
  user_id?: string;
  supplier_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gst_number?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSupabaseSuppliers = () => {
  const [suppliers, setSuppliers] = useState<SupabaseSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Load suppliers from Supabase
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  // Add a new supplier
  const addSupplier = async (supplierData: Omit<SupabaseSupplier, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSupplier = await supplierService.create(supplierData);
      setSuppliers(prev => [newSupplier, ...prev]);
      toast.success('Supplier created successfully');
      return newSupplier;
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error('Failed to create supplier');
      throw error;
    }
  };

  // Update supplier
  const updateSupplier = async (supplierId: string, updates: Partial<SupabaseSupplier>) => {
    try {
      const updatedSupplier = await supplierService.update(supplierId, updates);
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === supplierId ? updatedSupplier : supplier
      ));
      toast.success('Supplier updated successfully');
      return updatedSupplier;
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Failed to update supplier');
      throw error;
    }
  };

  // Delete supplier
  const deleteSupplier = async (supplierId: string) => {
    try {
      await supplierService.delete(supplierId);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier');
      throw error;
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    loadSuppliers
  };
};
