
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

// Product Services
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(product: Omit<Tables['products']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, product: Partial<Tables['products']['Update']>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
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

// Sales Services
export const salesService = {
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

  async create(sale: Omit<Tables['sales']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sales')
      .insert({ ...sale, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, sale: Partial<Tables['sales']['Update']>) {
    const { data, error } = await supabase
      .from('sales')
      .update(sale)
      .eq('id', id)
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

// Client Services
export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(client: Omit<Tables['clients']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert({ ...client, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, client: Partial<Tables['clients']['Update']>) {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
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

// Payment Services
export const paymentService = {
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

  async create(payment: Omit<Tables['payments']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .insert({ ...payment, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, payment: Partial<Tables['payments']['Update']>) {
    const { data, error } = await supabase
      .from('payments')
      .update(payment)
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

// Estimate Services
export const estimateService = {
  async getAll() {
    const { data, error } = await supabase
      .from('estimates')
      .select(`
        *,
        estimate_items(*),
        clients(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(estimate: Omit<Tables['estimates']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('estimates')
      .insert({ ...estimate, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, estimate: Partial<Tables['estimates']['Update']>) {
    const { data, error } = await supabase
      .from('estimates')
      .update(estimate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('estimates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Delivery Challan Services
export const deliveryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('delivery_challans')
      .select(`
        *,
        delivery_challan_items(*),
        clients(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(challan: Omit<Tables['delivery_challans']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('delivery_challans')
      .insert({ ...challan, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, challan: Partial<Tables['delivery_challans']['Update']>) {
    const { data, error } = await supabase
      .from('delivery_challans')
      .update(challan)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('delivery_challans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Supplier Services
export const supplierService = {
  async getAll() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(supplier: Omit<Tables['suppliers']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .insert({ ...supplier, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, supplier: Partial<Tables['suppliers']['Update']>) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplier)
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

// Expense Services
export const expenseService = {
  async getAll() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_categories(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(expense: Omit<Tables['expenses']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...expense, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, expense: Partial<Tables['expenses']['Update']>) {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Expense Category Services
export const expenseCategoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(category: Omit<Tables['expense_categories']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expense_categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, category: Partial<Tables['expense_categories']['Update']>) {
    const { data, error } = await supabase
      .from('expense_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Support Ticket Services
export const supportService = {
  async getAll() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(ticket: Omit<Tables['support_tickets']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ ...ticket, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, ticket: Partial<Tables['support_tickets']['Update']>) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(ticket)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Invoice Services
export const invoiceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items(*),
        clients(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(invoice: Omit<Tables['invoices']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('invoices')
      .insert({ ...invoice, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, invoice: Partial<Tables['invoices']['Update']>) {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Sales Returns Services
export const salesReturnService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sales_returns')
      .select(`
        *,
        products(product_name),
        clients(name),
        sales(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(salesReturn: Omit<Tables['sales_returns']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sales_returns')
      .insert({ ...salesReturn, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, salesReturn: Partial<Tables['sales_returns']['Update']>) {
    const { data, error } = await supabase
      .from('sales_returns')
      .update(salesReturn)
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

// Purchase Returns Services
export const purchaseReturnService = {
  async getAll() {
    const { data, error } = await supabase
      .from('purchase_returns')
      .select(`
        *,
        purchase_return_items(*),
        suppliers(supplier_name),
        purchase_orders(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(purchaseReturn: Omit<Tables['purchase_returns']['Insert'], 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('purchase_returns')
      .insert({ ...purchaseReturn, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, purchaseReturn: Partial<Tables['purchase_returns']['Update']>) {
    const { data, error } = await supabase
      .from('purchase_returns')
      .update(purchaseReturn)
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
