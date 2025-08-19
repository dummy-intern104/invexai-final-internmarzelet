
import { Product as GlobalProduct } from '@/types';

export interface Product extends GlobalProduct {
  // Use the global Product interface as base
}

export interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  addProduct: (productData: any) => void;
  updateProduct: (productId: string, updatedData: any) => void;
  deleteProduct: (productId: string) => void;
  importProductsFromCSV: (file: File) => Promise<void>;
  transferProduct: (productId: number, quantity: number, destinationType: string) => void;
  restockProduct: (productId: number, quantity: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadProductsFromSupabase: () => Promise<void>;
  addProductToSupabase: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProductInSupabase: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProductFromSupabase: (productId: string) => Promise<void>;
  syncInventoryLevel: (productId: string, newLevel: number) => Promise<void>;
}

export interface ProductSlice extends ProductState {
  // ProductSlice extends ProductState for compatibility
}
