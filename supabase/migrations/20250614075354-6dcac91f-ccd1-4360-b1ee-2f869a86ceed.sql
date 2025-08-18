
-- Create a table for product expiry tracking
CREATE TABLE public.product_expiry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  batch_number TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disposed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.product_expiry ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own product expiry records" 
  ON public.product_expiry 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own product expiry records" 
  ON public.product_expiry 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product expiry records" 
  ON public.product_expiry 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product expiry records" 
  ON public.product_expiry 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at column
CREATE TRIGGER update_product_expiry_updated_at
  BEFORE UPDATE ON public.product_expiry
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on expiry date queries
CREATE INDEX idx_product_expiry_date ON public.product_expiry(user_id, expiry_date);
CREATE INDEX idx_product_expiry_status ON public.product_expiry(user_id, status);
