
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  units: string;
  reorder_level: number;
  expiry_date?: string;
  supplier?: {
    company_name: string;
    gst_number: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface ProductSlice {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
