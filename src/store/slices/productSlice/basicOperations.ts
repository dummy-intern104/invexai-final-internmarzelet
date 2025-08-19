
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductState } from './types';

export const createBasicOperations = (set: any, get: any) => ({
  products: [],
  categories: ["Electronics", "Clothing", "Food", "Books", "Furniture", "Uncategorized"],
  loading: false,
  error: null,
  
  setProducts: (products: Product[]) => set({ products }),
  
  setCategories: (categories: string[]) => set({ categories }),
  
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  addProduct: (productData) => set((state: ProductState) => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: productData.product_name || productData.name,
      category: productData.category,
      price: productData.price,
      units: productData.units,
      reorder_level: productData.reorder_level,
      created_at: new Date().toISOString(),
      user_id: 'mock-user',
    };
    
    toast.success("Product added successfully");
    return { products: [...state.products, newProduct] };
  }),
  
  updateProduct: (productId: string, updatedData: any) => set((state: ProductState) => {
    const updatedProducts = state.products.map(product => 
      product.id === productId ? { ...product, ...updatedData } : product
    );
    toast.success("Product updated successfully");
    return { products: updatedProducts };
  }),
  
  deleteProduct: (productId: string) => set((state: ProductState) => {
    toast.success("Product deleted successfully");
    return { products: state.products.filter(product => product.id !== productId) };
  }),
});
