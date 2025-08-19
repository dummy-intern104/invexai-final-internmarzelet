
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const createSupabaseProductOperations = (set: any, get: any) => ({
  // Products operations
  setProducts: (products: any[]) => {
    set({ products });
  },

  addProduct: async (productData: any) => {
    try {
      const newProduct = await supabaseService.products.create(productData);
      set((state: any) => ({
        products: [newProduct, ...state.products]
      }));
      toast.success('Product added successfully');
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      throw error;
    }
  },

  updateProduct: async (productId: string, updatedData: any) => {
    try {
      const updatedProduct = await supabaseService.products.update(productId, updatedData);
      set((state: any) => ({
        products: state.products.map((product: any) =>
          product.id === productId ? updatedProduct : product
        )
      }));
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      await supabaseService.products.delete(productId);
      set((state: any) => ({
        products: state.products.filter((product: any) => product.id !== productId)
      }));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  },

  loadProducts: async () => {
    try {
      const products = await supabaseService.products.getAll();
      set({ products });
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    }
  },

  // Inventory operations with Supabase
  transferProduct: async (productId: number, quantity: number, destinationType: string) => {
    try {
      const fromLocation = destinationType === 'warehouse' ? 'local' : 'warehouse';
      const toLocation = destinationType === 'warehouse' ? 'warehouse' : 'local';
      
      await supabaseService.inventory.transferStock(
        productId, 
        quantity, 
        fromLocation as 'local' | 'warehouse', 
        toLocation as 'local' | 'warehouse'
      );
      
      toast.success(`Transferred ${quantity} units to ${destinationType}`);
    } catch (error) {
      console.error('Error transferring product:', error);
      toast.error('Failed to transfer product');
      throw error;
    }
  },

  restockProduct: async (productId: number, quantity: number) => {
    try {
      const inventory = await supabaseService.inventory.getByProduct(productId);
      if (inventory) {
        await supabaseService.inventory.createOrUpdate({
          product_id: productId,
          local_stock: inventory.local_stock + quantity
        });
        toast.success(`Restocked ${quantity} units`);
      }
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product');
      throw error;
    }
  }
});
