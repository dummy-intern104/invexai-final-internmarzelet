
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabaseProduct {
  id: string;
  user_id: string;
  product_name: string;
  category: string;
  price: number;
  units: string;
  reorder_level: number;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  supplier_company_name?: string;
  supplier_gst_number?: string;
  supplier_address?: string;
  supplier_city?: string;
  supplier_state?: string;
  supplier_pincode?: string;
}

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<SupabaseProduct, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProduct = await supabaseService.products.create(productData);
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product created successfully');
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      throw error;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<SupabaseProduct>) => {
    try {
      const updatedProduct = await supabaseService.products.update(productId, updates);
      setProducts(prev => prev.map(product => 
        product.id === productId ? updatedProduct : product
      ));
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await supabaseService.products.delete(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    loadProducts
  };
};
