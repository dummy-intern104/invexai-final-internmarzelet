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

  async create(inventoryItem: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('inventory')
      .insert([{ ...inventoryItem, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

   async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('product_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('product_id', id);

    if (error) throw error;
  },

  async transferStock(productId: string, amount: number, direction: 'warehouse-to-local' | 'local-to-warehouse') {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    // Fetch current stock levels
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('warehouse_stock, local_stock')
      .eq('product_id', productId)
      .single();

    if (inventoryError) throw inventoryError;
    if (!inventoryData) throw new Error('Inventory not found for product');

    let warehouseStock = inventoryData.warehouse_stock || 0;
    let localStock = inventoryData.local_stock || 0;

    if (direction === 'warehouse-to-local') {
      // Check if enough stock in warehouse
      if (warehouseStock < amount) {
        throw new Error('Not enough stock in warehouse');
      }
      warehouseStock -= amount;
      localStock += amount;
    } else {
      // Check if enough stock in local
      if (localStock < amount) {
        throw new Error('Not enough stock in local storage');
      }
      localStock -= amount;
      warehouseStock += amount;
    }

    // Update stock levels in database
    const { error: updateError } = await supabase
      .from('inventory')
      .update({ warehouse_stock: warehouseStock, local_stock: localStock })
      .eq('product_id', productId);

    if (updateError) throw updateError;
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
      .select('*')
      .eq('user_id', user.user.id)
      .order('date', { ascending: false });

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

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
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

// Product Expiry Service
export const productExpiriesService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('product_expiries')
      .select('*')
      .eq('user_id', user.user.id)
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(expiry: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('product_expiries')
      .insert([{ ...expiry, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('product_expiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('product_expiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Support Service (Complaints, Feedback, Tickets)
export const supportService = {
  async getAllComplaints() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createComplaint(complaint: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('complaints')
      .insert([{ ...complaint, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllFeedback() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createFeedback(feedback: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('feedback')
      .insert([{ ...feedback, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllTickets() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createTicket(ticket: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('tickets')
      .insert([{ ...ticket, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Purchase Returns Service
export const purchaseReturnService = {
  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('purchase_returns')
      .select(`
        *,
        suppliers (supplier_name)
      `)
      .eq('user_id', user.user.id)
      .order('return_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(returnData: any) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('purchase_returns')
      .insert([{ ...returnData, user_id: user.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('purchase_returns')
      .update(updates)
      .eq('return_number', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('purchase_returns')
      .delete()
      .eq('return_number', id);

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

// Client Service (alias for clients service)
export const clientService = clientsService;
