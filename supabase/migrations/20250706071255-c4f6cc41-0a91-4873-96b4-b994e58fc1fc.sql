
-- Create products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  product_name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  units text NOT NULL DEFAULT 'piece',
  reorder_level integer NOT NULL DEFAULT 0,
  supplier_company_name text,
  supplier_gst_number text,
  supplier_address text,
  supplier_city text,
  supplier_state text,
  supplier_pincode text,
  expiry_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES public.products,
  client_id uuid,
  quantity_sold integer NOT NULL,
  selling_price numeric NOT NULL,
  total_amount numeric NOT NULL,
  sale_date timestamp with time zone NOT NULL DEFAULT now(),
  payment_method text DEFAULT 'cash',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create clients table
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  gst_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  client_id uuid REFERENCES public.clients,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  payment_date timestamp with time zone NOT NULL DEFAULT now(),
  reference_number text,
  notes text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create estimates table
CREATE TABLE public.estimates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  client_id uuid REFERENCES public.clients,
  estimate_number text NOT NULL,
  client_name text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  valid_until date,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  terms text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create estimate items table
CREATE TABLE public.estimate_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id uuid REFERENCES public.estimates NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  gst_rate numeric NOT NULL DEFAULT 18,
  total numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create delivery challans table
CREATE TABLE public.delivery_challans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  client_id uuid REFERENCES public.clients,
  challan_number text NOT NULL,
  client_name text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  delivery_address text,
  vehicle_number text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create delivery challan items table
CREATE TABLE public.delivery_challan_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challan_id uuid REFERENCES public.delivery_challans NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  supplier_name text NOT NULL,
  contact_person text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  pincode text,
  gst_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  category_id uuid,
  title text NOT NULL,
  amount numeric NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  payment_method text DEFAULT 'cash',
  notes text,
  receipt_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create expense categories table
CREATE TABLE public.expense_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create sales returns table
CREATE TABLE public.sales_returns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  sale_id uuid REFERENCES public.sales,
  product_id uuid REFERENCES public.products,
  client_id uuid REFERENCES public.clients,
  quantity_returned integer NOT NULL,
  return_amount numeric NOT NULL,
  reason text,
  return_date timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create purchase returns table
CREATE TABLE public.purchase_returns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  purchase_order_id uuid REFERENCES public.purchase_orders,
  supplier_id uuid REFERENCES public.suppliers,
  return_number text NOT NULL,
  return_date timestamp with time zone NOT NULL DEFAULT now(),
  total_amount numeric NOT NULL DEFAULT 0,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create purchase return items table
CREATE TABLE public.purchase_return_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id uuid REFERENCES public.purchase_returns NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  ticket_number text NOT NULL,
  type text NOT NULL, -- 'complaint', 'feedback', 'support'
  subject text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status text NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  assigned_to text,
  resolution text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  client_id uuid REFERENCES public.clients,
  invoice_number text NOT NULL,
  client_name text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  due_date timestamp with time zone,
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  gst_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_mode text NOT NULL DEFAULT 'cash',
  status text NOT NULL DEFAULT 'pending',
  notes text,
  terms text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create invoice items table
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid REFERENCES public.invoices NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  gst_rate numeric NOT NULL DEFAULT 18,
  total numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_challan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Users can view their own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for sales
CREATE POLICY "Users can view their own sales" ON public.sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sales" ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales" ON public.sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales" ON public.sales FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients" ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payments" ON public.payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payments" ON public.payments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for estimates
CREATE POLICY "Users can view their own estimates" ON public.estimates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own estimates" ON public.estimates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own estimates" ON public.estimates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own estimates" ON public.estimates FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for estimate items
CREATE POLICY "Users can view their own estimate items" ON public.estimate_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));
CREATE POLICY "Users can create their own estimate items" ON public.estimate_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));
CREATE POLICY "Users can update their own estimate items" ON public.estimate_items FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));
CREATE POLICY "Users can delete their own estimate items" ON public.estimate_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));

-- Create RLS policies for delivery challans
CREATE POLICY "Users can view their own delivery challans" ON public.delivery_challans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own delivery challans" ON public.delivery_challans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own delivery challans" ON public.delivery_challans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own delivery challans" ON public.delivery_challans FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for delivery challan items
CREATE POLICY "Users can view their own delivery challan items" ON public.delivery_challan_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.delivery_challans WHERE delivery_challans.id = delivery_challan_items.challan_id AND delivery_challans.user_id = auth.uid()));
CREATE POLICY "Users can create their own delivery challan items" ON public.delivery_challan_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.delivery_challans WHERE delivery_challans.id = delivery_challan_items.challan_id AND delivery_challans.user_id = auth.uid()));
CREATE POLICY "Users can update their own delivery challan items" ON public.delivery_challan_items FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.delivery_challans WHERE delivery_challans.id = delivery_challan_items.challan_id AND delivery_challans.user_id = auth.uid()));
CREATE POLICY "Users can delete their own delivery challan items" ON public.delivery_challan_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.delivery_challans WHERE delivery_challans.id = delivery_challan_items.challan_id AND delivery_challans.user_id = auth.uid()));

-- Create RLS policies for suppliers
CREATE POLICY "Users can view their own suppliers" ON public.suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suppliers" ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own suppliers" ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for expense categories
CREATE POLICY "Users can view their own expense categories" ON public.expense_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own expense categories" ON public.expense_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expense categories" ON public.expense_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expense categories" ON public.expense_categories FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for sales returns
CREATE POLICY "Users can view their own sales returns" ON public.sales_returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sales returns" ON public.sales_returns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales returns" ON public.sales_returns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales returns" ON public.sales_returns FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for purchase returns
CREATE POLICY "Users can view their own purchase returns" ON public.purchase_returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchase returns" ON public.purchase_returns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchase returns" ON public.purchase_returns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchase returns" ON public.purchase_returns FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for purchase return items
CREATE POLICY "Users can view their own purchase return items" ON public.purchase_return_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.purchase_returns WHERE purchase_returns.id = purchase_return_items.return_id AND purchase_returns.user_id = auth.uid()));
CREATE POLICY "Users can create their own purchase return items" ON public.purchase_return_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.purchase_returns WHERE purchase_returns.id = purchase_return_items.return_id AND purchase_returns.user_id = auth.uid()));
CREATE POLICY "Users can update their own purchase return items" ON public.purchase_return_items FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.purchase_returns WHERE purchase_returns.id = purchase_return_items.return_id AND purchase_returns.user_id = auth.uid()));
CREATE POLICY "Users can delete their own purchase return items" ON public.purchase_return_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.purchase_returns WHERE purchase_returns.id = purchase_return_items.return_id AND purchase_returns.user_id = auth.uid()));

-- Create RLS policies for support tickets
CREATE POLICY "Users can view their own support tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own support tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own support tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own support tickets" ON public.support_tickets FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoices
CREATE POLICY "Users can view their own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invoices" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own invoices" ON public.invoices FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoice items
CREATE POLICY "Users can view their own invoice items" ON public.invoice_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can create their own invoice items" ON public.invoice_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can update their own invoice items" ON public.invoice_items FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can delete their own invoice items" ON public.invoice_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));

-- Create triggers to automatically update totals
CREATE OR REPLACE FUNCTION update_estimate_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.estimates 
  SET 
    total_amount = (
      SELECT COALESCE(SUM(total), 0)
      FROM public.estimate_items 
      WHERE estimate_id = COALESCE(NEW.estimate_id, OLD.estimate_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.estimate_id, OLD.estimate_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_estimate_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.estimate_items
  FOR EACH ROW EXECUTE FUNCTION update_estimate_total();

CREATE OR REPLACE FUNCTION update_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.invoices 
  SET 
    subtotal = (
      SELECT COALESCE(SUM(total), 0)
      FROM public.invoice_items 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Update total_amount based on subtotal, discount, and GST
  UPDATE public.invoices 
  SET 
    gst_amount = (subtotal - discount) * 0.18,
    total_amount = (subtotal - discount) + ((subtotal - discount) * 0.18)
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_total();

CREATE OR REPLACE FUNCTION update_purchase_return_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.purchase_returns 
  SET 
    total_amount = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM public.purchase_return_items 
      WHERE return_id = COALESCE(NEW.return_id, OLD.return_id)
    )
  WHERE id = COALESCE(NEW.return_id, OLD.return_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_purchase_return_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.purchase_return_items
  FOR EACH ROW EXECUTE FUNCTION update_purchase_return_total();
