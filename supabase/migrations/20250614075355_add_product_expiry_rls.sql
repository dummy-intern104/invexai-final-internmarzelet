
-- Add RLS policies for product_expiry table
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
