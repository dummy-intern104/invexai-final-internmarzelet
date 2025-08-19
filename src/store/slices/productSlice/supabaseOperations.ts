
import { StateCreator } from 'zustand';
import { supabaseService } from '@/services/supabaseService';
import { ProductSlice, Product } from './types';
import { toast } from 'sonner';

export interface SupabaseProductOperations {
  loadProductsFromSupabase: () => Promise<void>;
  addProductToSupabase: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProductInSupabase: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProductFromSupabase: (productId: string) => Promise<void>;
  syncInventoryLevel: (productId: string, newLevel: number) => Promise<void>;
}

export const createSupabaseProductOperations: StateCreator<
  ProductSlice,
  [],
  [],
  SupabaseProductOperations
> = (set, get) => ({
  loadProductsFromSupabase: async () => {
    try {
      set({ loading: true });
      const supabaseProducts = await supabaseService.products.getAll();
      
      const products: Product[] = supabaseProducts.map((sp: any) => ({
        id: sp.id,
        name: sp.product_name,
        category: sp.category,
        price: sp.price,
        units: sp.units,
        reorder_level: sp.reorder_level,
        expiry_date: sp.expiry_date || undefined,
        supplier: {
          company_name: sp.supplier_company_name || '',
          gst_number: sp.supplier_gst_number || '',
          address: sp.supplier_address || '',
          city: sp.supplier_city || '',
          state: sp.supplier_state || '',
          pincode: sp.supplier_pincode || ''
        }
      }));

      // Load inventory data for each product
      const productsWithInventory = await Promise.all(
        products.map(async (product) => {
          try {
            const inventory = await supabaseService.inventory.getByProduct(parseInt(product.id));
            return {
              ...product,
              units: inventory ? inventory.current_stock.toString() : '0'
            };
          } catch (error) {
            console.warn(`No inventory found for product ${product.id}`);
            return product;
          }
        })
      );

      set({ 
        products: productsWithInventory, 
        loading: false 
      });
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      set({ loading: false });
    }
  },

  addProductToSupabase: async (product: Omit<Product, 'id'>) => {
    try {
      const productData = {
        product_name: product.name,
        category: product.category,
        price: product.price,
        units: product.units,
        reorder_level: product.reorder_level,
        expiry_date: product.expiry_date,
        supplier_company_name: product.supplier?.company_name,
        supplier_gst_number: product.supplier?.gst_number,
        supplier_address: product.supplier?.address,
        supplier_city: product.supplier?.city,
        supplier_state: product.supplier?.state,
        supplier_pincode: product.supplier?.pincode
      };

      const newProduct = await supabaseService.products.create(productData);
      
      // Create inventory entry
      await supabaseService.inventory.createOrUpdate({
        product_id: parseInt(newProduct.id),
        current_stock: parseInt(product.units as string) || 0,
        warehouse_stock: 0,
        local_stock: parseInt(product.units as string) || 0,
        reserved_stock: 0,
        reorder_level: product.reorder_level,
        product_name: product.name
      });

      await get().loadProductsFromSupabase();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      throw error;
    }
  },

  updateProductInSupabase: async (productId: string, updates: Partial<Product>) => {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.product_name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.units) updateData.units = updates.units;
      if (updates.reorder_level !== undefined) updateData.reorder_level = updates.reorder_level;
      if (updates.expiry_date !== undefined) updateData.expiry_date = updates.expiry_date;
      
      if (updates.supplier) {
        updateData.supplier_company_name = updates.supplier.company_name;
        updateData.supplier_gst_number = updates.supplier.gst_number;
        updateData.supplier_address = updates.supplier.address;
        updateData.supplier_city = updates.supplier.city;
        updateData.supplier_state = updates.supplier.state;
        updateData.supplier_pincode = updates.supplier.pincode;
      }

      await supabaseService.products.update(productId, updateData);
      
      // Update inventory if units changed
      if (updates.units) {
        await supabaseService.inventory.createOrUpdate({
          product_id: parseInt(productId),
          current_stock: parseInt(updates.units as string),
          local_stock: parseInt(updates.units as string)
        });
      }

      await get().loadProductsFromSupabase();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  },

  deleteProductFromSupabase: async (productId: string) => {
    try {
      await supabaseService.products.delete(productId);
      await get().loadProductsFromSupabase();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  },

  syncInventoryLevel: async (productId: string, newLevel: number) => {
    try {
      await supabaseService.inventory.createOrUpdate({
        product_id: parseInt(productId),
        current_stock: newLevel,
        local_stock: newLevel
      });
      
      await get().loadProductsFromSupabase();
    } catch (error) {
      console.error('Error syncing inventory:', error);
      throw error;
    }
  }
});
