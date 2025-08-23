
-- Add proper foreign key relationships to the sales table
-- This will enable proper joins in Supabase queries

-- First, let's add the foreign key constraint for client_id
ALTER TABLE public.sales 
ADD CONSTRAINT fk_sales_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) 
ON DELETE SET NULL;

-- Add the foreign key constraint for product_id  
ALTER TABLE public.sales 
ADD CONSTRAINT fk_sales_product_id 
FOREIGN KEY (product_id) REFERENCES public.products(id) 
ON DELETE SET NULL;

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON public.sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON public.sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON public.sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON public.sales(sale_date);
