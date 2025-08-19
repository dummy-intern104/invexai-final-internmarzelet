import { supabase } from '@/integrations/supabase/client';

// Enhanced Supabase service with all entity operations
export const supabaseService = {
  // Products service
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async create(productData: any) {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
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
  },

  // Sales service
  sales: {
    async getAll() {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products(product_name),
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async create(saleData: any) {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          ...saleData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
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
  },

  // Clients service
  clients: {
    async getAll() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async create(clientData: any) {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
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
  },

  // Payments service
  payments: {
    async getAll() {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async create(paymentData: any) {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          ...paymentData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
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
  },

  // Meetings service
  meetings: {
    async getAll() {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    async create(meetingData: any) {
      const { data, error } = await supabase
        .from('meetings')
        .insert([{
          ...meetingData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
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
  },

  // Inventory service
  inventory: {
    async getAll() {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('product_name');
      
      if (error) throw error;
      return data || [];
    },

    async getByProduct(productId: number) {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },

    async createOrUpdate(inventoryData: any) {
      const existing = await this.getByProduct(inventoryData.product_id);
      
      if (existing) {
        const { data, error } = await supabase
          .from('inventory')
          .update(inventoryData)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('inventory')
          .insert([{
            ...inventoryData,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },

    async transferStock(productId: number, quantity: number, fromLocation: 'warehouse' | 'local', toLocation: 'warehouse' | 'local') {
      const inventory = await this.getByProduct(productId);
      if (!inventory) throw new Error('Product not found in inventory');

      const fromField = fromLocation === 'warehouse' ? 'warehouse_stock' : 'local_stock';
      const toField = toLocation === 'warehouse' ? 'warehouse_stock' : 'local_stock';

      if (inventory[fromField] < quantity) {
        throw new Error('Insufficient stock for transfer');
      }

      const updates = {
        [fromField]: inventory[fromField] - quantity,
        [toField]: inventory[toField] + quantity
      };

      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', inventory.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Dashboard analytics service
  analytics: {
    async getSalesAnalytics() {
      const { data: sales, error } = await supabase
        .from('sales')
        .select('*');
      
      if (error) throw error;

      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const thisYear = new Date(today.getFullYear(), 0, 1);

      const todaySales = sales?.filter(sale => 
        new Date(sale.sale_date).toDateString() === today.toDateString()
      ) || [];

      const monthSales = sales?.filter(sale => 
        new Date(sale.sale_date) >= thisMonth
      ) || [];

      const yearSales = sales?.filter(sale => 
        new Date(sale.sale_date) >= thisYear
      ) || [];

      return {
        todayRevenue: todaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0),
        monthlyRevenue: monthSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0),
        yearlyRevenue: yearSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0),
        todayTransactions: todaySales.length,
        monthlyTransactions: monthSales.length,
        yearlyTransactions: yearSales.length
      };
    },

    async getInventoryAnalytics() {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;

      const { data: inventory, error: invError } = await supabase
        .from('inventory')
        .select('*');

      if (invError) throw invError;

      const totalProducts = products?.length || 0;
      const lowStockItems = inventory?.filter(item => 
        item.current_stock <= item.reorder_level
      ) || [];
      const outOfStockItems = inventory?.filter(item => 
        item.current_stock === 0
      ) || [];

      return {
        totalProducts,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        totalInventoryValue: inventory?.reduce((sum, item) => {
          const product = products?.find(p => p.id === item.product_id);
          return sum + (item.current_stock * (product?.price || 0));
        }, 0) || 0
      };
    },

    async getRevenueChartData() {
      const { data: sales, error } = await supabase
        .from('sales')
        .select('sale_date, total_amount')
        .order('sale_date');
      
      if (error) throw error;

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      return last30Days.map(date => {
        const daySales = sales?.filter(sale => 
          sale.sale_date.split('T')[0] === date
        ) || [];
        
        return {
          name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: daySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0)
        };
      });
    },

    async getTopProductsData() {
      const { data: sales, error } = await supabase
        .from('sales')
        .select(`
          quantity_sold,
          total_amount,
          products(product_name)
        `);
      
      if (error) throw error;

      const productStats = sales?.reduce((acc: any, sale) => {
        const productName = sale.products?.product_name || 'Unknown';
        if (!acc[productName]) {
          acc[productName] = { quantity: 0, revenue: 0 };
        }
        acc[productName].quantity += sale.quantity_sold || 0;
        acc[productName].revenue += sale.total_amount || 0;
        return acc;
      }, {}) || {};

      return Object.entries(productStats)
        .sort(([,a]: any, [,b]: any) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(([name, stats]: any) => ({
          name,
          value: stats.revenue
        }));
    }
  }
};

// Keep existing services for backward compatibility
export const supplierService = supabaseService.suppliers || {
  async getAll() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(supplierData: any) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([{
        ...supplierData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const purchaseReturnService = {
  async getAll() {
    const { data, error } = await supabase
      .from('purchase_returns')
      .select(`
        *,
        suppliers(supplier_name),
        purchase_orders(order_number)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(returnData: any) {
    const { data, error } = await supabase
      .from('purchase_returns')
      .insert([{
        ...returnData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('purchase_returns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('purchase_returns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
