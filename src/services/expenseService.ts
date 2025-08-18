
import { supabase } from "@/integrations/supabase/client";

export const fetchExpenses = async (dateFrom?: string, dateTo?: string) => {
  let query = supabase
    .from('expenses')
    .select(`
      *,
      expense_categories (
        name
      )
    `)
    .order('date', { ascending: false });

  if (dateFrom) {
    query = query.gte('date', dateFrom);
  }
  if (dateTo) {
    query = query.lte('date', dateTo);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchExpenseCategories = async () => {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching expense categories:', error);
    throw error;
  }
  
  return data || [];
};

export const createExpense = async (expenseData: {
  title: string;
  amount: number;
  category_id?: string;
  payment_method?: string;
  notes?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      ...expenseData,
      user_id: user.id
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
  
  return data;
};
