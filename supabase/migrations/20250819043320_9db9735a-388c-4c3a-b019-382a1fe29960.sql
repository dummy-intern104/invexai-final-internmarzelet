
-- Create meetings table
CREATE TABLE public.meetings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  client_id uuid REFERENCES public.clients(id),
  title text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  type text NOT NULL CHECK (type IN ('call', 'video', 'in-person')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  client_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meetings
CREATE POLICY "Users can view their own meetings" 
  ON public.meetings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meetings" 
  ON public.meetings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings" 
  ON public.meetings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings" 
  ON public.meetings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update inventory table to support stock transfers
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS warehouse_stock integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS local_stock integer NOT NULL DEFAULT 0;

-- Update current_stock to be computed column (warehouse + local)
UPDATE public.inventory 
SET warehouse_stock = current_stock / 2,
    local_stock = current_stock / 2
WHERE current_stock > 0;

-- Add constraint to ensure stock consistency
ALTER TABLE public.inventory 
ADD CONSTRAINT check_stock_consistency 
CHECK (current_stock = warehouse_stock + local_stock);

-- Create function to update current_stock automatically
CREATE OR REPLACE FUNCTION public.update_inventory_current_stock()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.current_stock = NEW.warehouse_stock + NEW.local_stock;
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

-- Create trigger for inventory stock updates
DROP TRIGGER IF EXISTS update_inventory_stock ON public.inventory;
CREATE TRIGGER update_inventory_stock
  BEFORE INSERT OR UPDATE OF warehouse_stock, local_stock ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_inventory_current_stock();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_inventory_user_product ON public.inventory(user_id, product_id);
