
import { supabase } from '@/integrations/supabase/client';
import { GSTDetails } from '@/types';

// Products Service
const productsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (productData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert([{ ...productData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (productId: string, updates: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
  }
};

// Sales Service
const salesService = {
  getAll: async () => {
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (saleData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sales')
      .insert([{ ...saleData, user_id: user.id }])
      .select(`
        *,
        products (
          product_name
        ),
        clients (
          name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (saleId: string) => {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', saleId);

    if (error) throw error;
  }
};

// Clients Service
const clientsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (clientData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...clientData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (clientId: string, updates: any) => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (clientId: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  }
};

// Payments Service
const paymentsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        clients (
          name
        )
      `)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (paymentData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .insert([{ ...paymentData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (paymentId: string) => {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId);

    if (error) throw error;
  }
};

// Meetings Service
const meetingsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (meetingData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('meetings')
      .insert([{ ...meetingData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (meetingId: string, updates: any) => {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', meetingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (meetingId: string) => {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId);

    if (error) throw error;
  }
};

// Suppliers Service
const suppliersService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('company_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  create: async (supplierData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .insert([{ ...supplierData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

   update: async (supplierId: string, updates: any) => {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', supplierId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (supplierId: string) => {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', supplierId);

    if (error) throw error;
  }
};

// Expense Service
const expenseService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (expenseData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expenseData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (expenseId: string, updates: any) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (expenseId: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) throw error;
  }
};

// Sales Returns Service
const salesReturnsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('sales_returns')
      .select(`
        *,
        clients (
          name
        ),
        products (
          product_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (returnData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sales_returns')
      .insert([{ ...returnData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (returnId: string, updates: any) => {
    const { data, error } = await supabase
      .from('sales_returns')
      .update(updates)
      .eq('id', returnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (returnId: string) => {
    const { error } = await supabase
      .from('sales_returns')
      .delete()
      .eq('id', returnId);

    if (error) throw error;
  }
};

// Purchase Returns Service
const purchaseReturnsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('purchase_returns')
      .select(`
        *,
        suppliers (
          supplier_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (returnData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('purchase_returns')
      .insert([{ ...returnData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (returnId: string, updates: any) => {
    const { data, error } = await supabase
      .from('purchase_returns')
      .update(updates)
      .eq('id', returnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (returnId: string) => {
    const { error } = await supabase
      .from('purchase_returns')
      .delete()
      .eq('id', returnId);

    if (error) throw error;
  }
};

// Enhanced inventory service with getByProduct method
const inventoryService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  createOrUpdate: async (inventoryData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('inventory')
      .upsert({ ...inventoryData, user_id: user.id }, { onConflict: 'product_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  transferStock: async (productId: number, quantity: number, from: 'warehouse' | 'local', to: 'warehouse' | 'local') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Fetch current inventory
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (inventoryError) throw inventoryError;
    if (!inventoryData) throw new Error('Inventory not found');

    const fromKey = `${from}_stock`;
    const toKey = `${to}_stock`;

    if (inventoryData[fromKey] < quantity) {
      throw new Error(`Insufficient stock in ${from}`);
    }

    const updates = {
      [fromKey]: inventoryData[fromKey] - quantity,
      [toKey]: inventoryData[toKey] + quantity,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getByProduct: async (productId: number) => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

const analyticsService = {
  getSalesAnalytics: async () => {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: todaySales, error: todayError } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('sale_date', today);

    const { data: monthlySales, error: monthlyError } = await supabase
      .from('sales')
      .select('total_amount')
      .gte('sale_date', thirtyDaysAgo);

    const { data: yearlySales, error: yearlyError } = await supabase
      .from('sales')
      .select('total_amount')
      .gte('sale_date', oneYearAgo);

    const { data: todayTransactions, error: todayTransactionsError } = await supabase
      .from('sales')
      .select('*')
      .eq('sale_date', today);

    const { data: monthlyTransactions, error: monthlyTransactionsError } = await supabase
      .from('sales')
      .select('*')
      .gte('sale_date', thirtyDaysAgo);

     const { data: yearlyTransactions, error: yearlyTransactionsError } = await supabase
      .from('sales')
      .select('*')
      .gte('sale_date', oneYearAgo);

    if (todayError || monthlyError || yearlyError || todayTransactionsError || monthlyTransactionsError || yearlyTransactionsError) {
      throw new Error('Error fetching sales data');
    }

    const todayRevenue = (todaySales || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const monthlyRevenue = (monthlySales || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const yearlyRevenue = (yearlySales || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const todayTrans = (todayTransactions || []).length;
    const monthlyTrans = (monthlyTransactions || []).length;
    const yearlyTrans = (yearlyTransactions || []).length;

    return {
      todayRevenue,
      monthlyRevenue,
      yearlyRevenue,
      todayTransactions: todayTrans,
      monthlyTransactions: monthlyTrans,
      yearlyTransactions: yearlyTrans
    };
  },

  getInventoryAnalytics: async () => {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*');

    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('*');

    if (productsError || inventoryError) {
      throw new Error('Error fetching inventory data');
    }

    const totalProducts = (productsData || []).length;
    const lowStockCount = (inventoryData || []).filter(item => item.current_stock <= item.reorder_level).length;
    const outOfStockCount = (inventoryData || []).filter(item => item.current_stock === 0).length;
    const totalInventoryValue = (inventoryData || []).reduce((sum, item) => sum + (item.current_stock * (item.cost_price || 0)), 0);

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue
    };
  },

  getRevenueChartData: async (): Promise<Array<{name: string, value: number}>> => {
    const { data, error } = await supabase
      .from('sales')
      .select('sale_date, total_amount')
      .gte('sale_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('sale_date', { ascending: true });

    if (error) throw error;

    // Group by date and sum amounts
    const groupedData: { [key: string]: number } = {};
    (data || []).forEach((sale: any) => {
      const date = new Date(sale.sale_date).toLocaleDateString();
      groupedData[date] = (groupedData[date] || 0) + (sale.total_amount || 0);
    });

    return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
  },

  getTopProductsData: async (): Promise<Array<{name: string, value: number}>> => {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        quantity_sold,
        products!inner(product_name)
      `)
      .limit(10);

    if (error) throw error;

    // Group by product and sum quantities
    const groupedData: { [key: string]: number } = {};
    (data || []).forEach((sale: any) => {
      const productName = sale.products?.product_name || 'Unknown Product';
      groupedData[productName] = (groupedData[productName] || 0) + (sale.quantity_sold || 0);
    });

    return Object.entries(groupedData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }
};

export const supabaseService = {
  products: productsService,
  sales: salesService,
  clients: clientsService,
  payments: paymentsService,
  meetings: meetingsService,
  inventory: inventoryService,
  analytics: analyticsService,
  suppliers: suppliersService,
  expenses: expenseService,
  purchaseReturns: purchaseReturnsService,
  salesReturns: salesReturnsService
};

// Legacy aliases for backward compatibility
export { productsService, salesService, clientsService, paymentsService, meetingsService, suppliersService, expenseService };
export const salesReturnService = salesReturnsService;
export const purchaseReturnService = purchaseReturnsService;
export const expenseCategoryService = expenseService;

export default supabaseService;
