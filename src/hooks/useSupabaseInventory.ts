
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabaseInventory {
  id: string;
  user_id: string;
  product_id: number;
  current_stock: number;
  warehouse_stock: number;
  local_stock: number;
  reserved_stock: number;
  reorder_level: number;
  product_name: string;
  location?: string;
  last_updated: string;
}

export const useSupabaseInventory = () => {
  const [inventory, setInventory] = useState<SupabaseInventory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.inventory.getAll();
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (inventoryData: Partial<SupabaseInventory> & { product_id: number }) => {
    try {
      const updatedInventory = await supabaseService.inventory.createOrUpdate(inventoryData);
      setInventory(prev => {
        const existingIndex = prev.findIndex(item => item.product_id === inventoryData.product_id);
        if (existingIndex >= 0) {
          const newInventory = [...prev];
          newInventory[existingIndex] = updatedInventory;
          return newInventory;
        } else {
          return [updatedInventory, ...prev];
        }
      });
      toast.success('Inventory updated successfully');
      return updatedInventory;
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Failed to update inventory');
      throw error;
    }
  };

  const transferStock = async (productId: number, quantity: number, from: 'warehouse' | 'local', to: 'warehouse' | 'local') => {
    try {
      const updatedInventory = await supabaseService.inventory.transferStock(productId, quantity, from, to);
      setInventory(prev => prev.map(item => 
        item.product_id === productId ? updatedInventory : item
      ));
      toast.success(`Transferred ${quantity} units from ${from} to ${to}`);
      return updatedInventory;
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast.error('Failed to transfer stock');
      throw error;
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return {
    inventory,
    loading,
    updateInventory,
    transferStock,
    loadInventory
  };
};
