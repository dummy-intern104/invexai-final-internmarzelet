
export interface Product {
  id: string; // Supabase uses string UUIDs
  product_id?: number; // Keep for backward compatibility with existing code
  product_name: string;
  category: string;
  expiry_date?: string;
  price: number;
  units: string;
  reorder_level: number;
  created_at: string;
  user_id: string;
  supplier_company_name?: string;
  supplier_gst_number?: string;
  supplier_address?: string;
  supplier_city?: string;
  supplier_state?: string;
  supplier_pincode?: string;
  // Add estimate properties for sales
  estimateId?: string;
  shouldCompleteEstimate?: boolean;
}

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface Inventory {
  inventory_id: number;
  product_id: number;
  quantity_in_stock: number;
  last_updated: string;
  product?: Product;
}

export interface Sale {
  sale_id: number;
  product_id: number;
  quantity_sold: number;
  selling_price: number;
  sale_date: string;
  product?: Product;
  clientId?: number;
  clientName?: string;
  relatedSaleId?: number;
  transactionId?: string; // Add transaction ID for deduplication
  // Add estimate properties
  estimateId?: string;
  shouldCompleteEstimate?: boolean;
}

export interface ProductPurchase {
  productName: string;
  quantity: number;
  amount: number;
  purchaseDate: string;
  transactionId?: string; // Add transaction ID for deduplication
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
  joinDate: string;
  openInvoices: number;
  purchaseHistory: ProductPurchase[];
  gstNumber?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Payment {
  id: number;
  date: string;
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  method: string;
  description?: string;
  relatedSaleId?: number;
  gstNumber?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  transactionId?: string; // Add transaction ID for deduplication
}

// Meeting Interface
export interface Meeting {
  id: string;
  clientId: number;
  clientName: string;
  title: string;
  date: string;
  time: string;
  type: 'call' | 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// Product Expiry Interface
export interface ProductExpiry {
  id: string;
  user_id: string;
  product_id: number;
  product_name: string;
  expiry_date: string;
  batch_number?: string;
  quantity: number;
  status: 'active' | 'expired' | 'disposed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryAnalysis {
  analysis_id: number;
  product_id: number;
  seasonal_demand_prediction: string;
  weekly_sales_trend: string;
  festival_event_demand: string;
  expiry_based_recommendation: string;
  supplier_price_trend: string;
  stock_optimization_alert: string;
  competitor_price_monitoring: string;
  analysis_date: string;
  product?: Product;
}

export interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
}

export interface StockPredictionInput {
  date: string;
  product_id: number;
  current_stock: number;
  previous_sales: number;
  price: number;
}

export interface GSTDetails {
  gstNumber: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate?: string;
  businessType?: string;
  stateCode?: string;
}

export interface GSTLookupResult {
  success: boolean;
  data?: GSTDetails;
  error?: string;
}

export interface SupplierDetails {
  companyName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate?: string;
  businessType?: string;
}
