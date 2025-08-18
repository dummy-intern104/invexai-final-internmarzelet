
-- Add sales_returns field to user_data table
ALTER TABLE public.user_data 
ADD COLUMN sales_returns jsonb DEFAULT '[]'::jsonb;
