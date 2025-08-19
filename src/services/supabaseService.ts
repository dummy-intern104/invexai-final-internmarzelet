
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in .env.local');
}

if (!supabaseKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Products Service
export const productsService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(product: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Suppliers Service
export const suppliersService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(supplier: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .insert([{ ...supplier, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('supplier_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('supplier_id', id);

    if (error) throw error;
  }
};

// Inventory Service
export const inventoryService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products (
          product_name,
          price
        )
      `)
      .eq('user_id', user.user.id)
      .order('last_updated', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createOrUpdate(inventoryData: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('inventory')
      .upsert([{ ...inventoryData, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async transferStock(productId: number, quantity: number, from: 'warehouse' | 'local', to: 'warehouse' | 'local') {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    // Get current inventory
    const { data: inventory, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', user.user.id)
      .single();

    if (fetchError) throw fetchError;

    // Calculate new stock levels
    const updates: any = {};
    if (from === 'warehouse' && to === 'local') {
      if (inventory.warehouse_stock < quantity) {
        throw new Error('Not enough warehouse stock');
      }
      updates.warehouse_stock = inventory.warehouse_stock - quantity;
      updates.local_stock = inventory.local_stock + quantity;
    } else if (from === 'local' && to === 'warehouse') {
      if (inventory.local_stock < quantity) {
        throw new Error('Not enough local stock');
      }
      updates.local_stock = inventory.local_stock - quantity;
      updates.warehouse_stock = inventory.warehouse_stock + quantity;
    }

    // Update inventory
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('product_id', productId)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Sales Service
export const salesService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        products (
          product_name
        ),
        clients (
          name
        )
      `)
      .eq('user_id', user.user.id)
      .order('sale_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(sale: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sales')
      .insert([{ ...sale, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Clients Service
export const clientsService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(client: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Payments Service
export const paymentsService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        clients (
          name
        )
      `)
      .eq('user_id', user.user.id)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(payment: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .insert([{ ...payment, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Meetings Service
export const meetingsService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', user.user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(meeting: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('meetings')
      .insert([{ ...meeting, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Sales Returns Service
export const salesReturnService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sales_returns')
      .select(`
        *,
        products(product_name),
        clients(name)
      `)
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(returnData: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sales_returns')
      .insert([{ ...returnData, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('sales_returns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sales_returns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Analytics Service
export const analyticsService = {
  async getSalesAnalytics() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    const thisYear = new Date().getFullYear();

    // Get sales data
    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_amount, sale_date')
      .eq('user_id', user.user.id);

    if (error) throw error;

    const todayRevenue = sales?.filter(s => s.sale_date === today)
      .reduce((sum, s) => sum + s.total_amount, 0) || 0;

    const monthlyRevenue = sales?.filter(s => s.sale_date.startsWith(thisMonth))
      .reduce((sum, s) => sum + s.total_amount, 0) || 0;

    const yearlyRevenue = sales?.filter(s => s.sale_date.startsWith(thisYear.toString()))
      .reduce((sum, s) => sum + s.total_amount, 0) || 0;

    const todayTransactions = sales?.filter(s => s.sale_date === today).length || 0;
    const monthlyTransactions = sales?.filter(s => s.sale_date.startsWith(thisMonth)).length || 0;
    const yearlyTransactions = sales?.filter(s => s.sale_date.startsWith(thisYear.toString())).length || 0;

    return {
      todayRevenue,
      monthlyRevenue,
      yearlyRevenue,
      todayTransactions,
      monthlyTransactions,
      yearlyTransactions
    };
  },

  async getInventoryAnalytics() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.user.id);

    const { data: inventory } = await supabase
      .from('inventory')
      .select('current_stock, reorder_level')
      .eq('user_id', user.user.id);

    const totalProducts = products?.length || 0;
    const lowStockCount = inventory?.filter(i => i.current_stock <= i.reorder_level && i.current_stock > 0).length || 0;
    const outOfStockCount = inventory?.filter(i => i.current_stock === 0).length || 0;

    // Calculate total inventory value
    const { data: inventoryWithProducts } = await supabase
      .from('inventory')
      .select(`
        current_stock,
        products(price)
      `)
      .eq('user_id', user.user.id);

    const totalInventoryValue = inventoryWithProducts?.reduce((sum, item) => {
      return sum + (item.current_stock * (item.products?.price || 0));
    }, 0) || 0;

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue
    };
  },

  async getRevenueChartData() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_amount, sale_date')
      .eq('user_id', user.user.id)
      .order('sale_date', { ascending: true });

    if (error) throw error;

    // Group by month for the chart
    const monthlyData = sales?.reduce((acc: any, sale) => {
      const month = sale.sale_date.slice(0, 7);
      if (!acc[month]) {
        acc[month] = { name: month, value: 0 };
      }
      acc[month].value += sale.total_amount;
      return acc;
    }, {});

    return Object.values(monthlyData || {});
  },

  async getTopProductsData() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data: sales, error } = await supabase
      .from('sales')
      .select(`
        quantity_sold,
        products(product_name)
      `)
      .eq('user_id', user.user.id);

    if (error) throw error;

    // Group by product
    const productData = sales?.reduce((acc: any, sale) => {
      const productName = sale.products?.product_name || 'Unknown';
      if (!acc[productName]) {
        acc[productName] = { name: productName, value: 0 };
      }
      acc[productName].value += sale.quantity_sold;
      return acc;
    }, {});

    return Object.values(productData || {}).slice(0, 5); // Top 5
  }
};

// Create a unified service object
export const supabaseService = {
  products: productsService,
  sales: salesService,
  clients: clientsService,
  payments: paymentsService,
  meetings: meetingsService,
  inventory: inventoryService,
  analytics: analyticsService
};

// Aliases for backward compatibility
export const clientService = clientsService;
export const supplierService = suppliersService;
export const productService = productsService;
export const paymentService = paymentsService;

// Mock expense service for now (to be implemented later)
export const expenseService = {
  async getAll() { return []; },
  async create() { return null; },
  async update() { return null; },
  async delete() { return null; }
};

export const expenseCategoryService = {
  async getAll() { return []; },
  async create() { return null; },
  async update() { return null; },
  async delete() { return null; }
};
