
import { supabase } from "@/integrations/supabase/client";
import { 
  productService, 
  salesService, 
  clientService, 
  paymentService,
  expenseService,
  supplierService,
  purchaseReturnService,
  salesReturnService 
} from "./supabaseService";

export interface ReportData {
  sales: any[];
  products: any[];
  clients: any[];
  payments: any[];
  expenses?: any[];
  suppliers?: any[];
  purchaseReturns?: any[];
  salesReturns?: any[];
}

export const fetchReportData = async (): Promise<ReportData> => {
  try {
    const [sales, products, clients, payments, expenses, suppliers, purchaseReturns, salesReturns] = await Promise.all([
      salesService.getAll(),
      productService.getAll(),
      clientService.getAll(),
      paymentService.getAll(),
      expenseService.getAll(),
      supplierService.getAll(),
      purchaseReturnService.getAll(),
      salesReturnService.getAll()
    ]);

    return {
      sales: sales || [],
      products: products || [],
      clients: clients || [],
      payments: payments || [],
      expenses: expenses || [],
      suppliers: suppliers || [],
      purchaseReturns: purchaseReturns || [],
      salesReturns: salesReturns || []
    };
  } catch (error) {
    console.error('Error fetching report data:', error);
    return {
      sales: [],
      products: [],
      clients: [],
      payments: [],
      expenses: [],
      suppliers: [],
      purchaseReturns: [],
      salesReturns: []
    };
  }
};

// Helper functions for DailySales component
export const getFilteredSales = (sales: any[], date: string) => {
  return sales.filter(sale => 
    new Date(sale.sale_date).toDateString() === new Date(date).toDateString()
  );
};

export const calculateSalesMetrics = (sales: any[]) => {
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
  const totalInvoices = sales.length;
  
  return {
    totalSales,
    totalInvoices
  };
};

// Daily Sales Report
export const getDailySalesReport = async (date: string) => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      products(product_name),
      clients(name)
    `)
    .gte('sale_date', `${date}T00:00:00`)
    .lte('sale_date', `${date}T23:59:59`)
    .order('sale_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Monthly Sales Report
export const getMonthlySalesReport = async (year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      products(product_name),
      clients(name)
    `)
    .gte('sale_date', startDate.toISOString())
    .lte('sale_date', endDate.toISOString())
    .order('sale_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Yearly Sales Report
export const getYearlySalesReport = async (year: number) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      products(product_name),
      clients(name)
    `)
    .gte('sale_date', startDate.toISOString())
    .lte('sale_date', endDate.toISOString())
    .order('sale_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Stock Reports
export const getStockReport = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products(product_name, category, price)
    `)
    .order('current_stock', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Low Stock Report - Fixed RPC call
export const getLowStockReport = async () => {
  // Direct query without RPC since we can filter this way
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products(product_name, category, price)
    `)
    .order('current_stock', { ascending: true });
  
  if (error) throw error;
  
  // Filter low stock items where current_stock <= reorder_level
  return (data || []).filter(item => item.current_stock <= item.reorder_level);
};

// Profit & Loss Report
export const getProfitLossReport = async (startDate: string, endDate: string) => {
  const [salesData, expenseData] = await Promise.all([
    supabase
      .from('sales')
      .select('total_amount, selling_price, quantity_sold')
      .gte('sale_date', startDate)
      .lte('sale_date', endDate),
    supabase
      .from('expenses')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDate)
  ]);

  if (salesData.error) throw salesData.error;
  if (expenseData.error) throw expenseData.error;

  const totalRevenue = (salesData.data || []).reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalExpenses = (expenseData.data || []).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const profit = totalRevenue - totalExpenses;

  return {
    totalRevenue,
    totalExpenses,
    profit,
    sales: salesData.data || [],
    expenses: expenseData.data || []
  };
};

// GST Report
export const getGSTReport = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_items(*)
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;

  const gstSummary = (data || []).reduce((acc, invoice) => {
    acc.totalGST += Number(invoice.gst_amount);
    acc.totalSales += Number(invoice.total_amount);
    return acc;
  }, { totalGST: 0, totalSales: 0 });

  return {
    ...gstSummary,
    invoices: data || []
  };
};
