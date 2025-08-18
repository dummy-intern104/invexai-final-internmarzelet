
-- Add purchase_returns and suppliers fields to user_data table
ALTER TABLE public.user_data 
ADD COLUMN purchase_returns jsonb DEFAULT '[]'::jsonb,
ADD COLUMN suppliers jsonb DEFAULT '[]'::jsonb;
