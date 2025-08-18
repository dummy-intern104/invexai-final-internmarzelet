
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductState } from './types';

export const createBasicOperations = (set: any, get: any) => ({
  products: [],
  categories: ["Electronics", "Clothing", "Food", "Books", "Furniture", "Uncategorized"],
  
  setProducts: (products: Product[]) => set({ products }),
  
  setCategories: (categories: string[]) => set({ categories }),
  
  addProduct: (productData) => set((state: ProductState) => {
    const newProductId = state.products.length > 0 ? Math.max(...state.products.map(p => p.product_id || 0)) + 1 : 1;
    const newProduct: Product = {
      id: `product-${newProductId}`, // Generate string ID
      product_id: newProductId,
      product_name: productData.product_name,
      category: productData.category,
      price: productData.price,
      units: productData.units,
      reorder_level: productData.reorder_level,
      created_at: new Date().toISOString(),
      user_id: 'mock-user', // Add required user_id
    };
    
    toast.success("Product added successfully");
    return { products: [...state.products, newProduct] };
  }),
  
  deleteProduct: (productId) => set((state: ProductState) => {
    toast.success("Product deleted successfully");
    return { products: state.products.filter(product => product.product_id !== productId) };
  }),
});
