
-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  order_number TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_contact TEXT,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table for real stock tracking
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  reserved_stock INTEGER NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
  reorder_level INTEGER NOT NULL DEFAULT 0,
  location TEXT DEFAULT 'main',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, location)
);

-- Enable RLS on all tables
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- RLS policies for purchase_orders
CREATE POLICY "Users can view their own purchase orders" 
  ON public.purchase_orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchase orders" 
  ON public.purchase_orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchase orders" 
  ON public.purchase_orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchase orders" 
  ON public.purchase_orders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for purchase_order_items
CREATE POLICY "Users can view their own purchase order items" 
  ON public.purchase_order_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.purchase_orders 
      WHERE id = purchase_order_items.purchase_order_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own purchase order items" 
  ON public.purchase_order_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.purchase_orders 
      WHERE id = purchase_order_items.purchase_order_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own purchase order items" 
  ON public.purchase_order_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.purchase_orders 
      WHERE id = purchase_order_items.purchase_order_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own purchase order items" 
  ON public.purchase_order_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.purchase_orders 
      WHERE id = purchase_order_items.purchase_order_id 
      AND user_id = auth.uid()
    )
  );

-- RLS policies for inventory
CREATE POLICY "Users can view their own inventory" 
  ON public.inventory 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory" 
  ON public.inventory 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory" 
  ON public.inventory 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory" 
  ON public.inventory 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update purchase order total
CREATE OR REPLACE FUNCTION update_purchase_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.purchase_orders 
  SET 
    total_amount = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM public.purchase_order_items 
      WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update purchase order totals
CREATE TRIGGER trigger_update_purchase_order_total_on_insert
  AFTER INSERT ON public.purchase_order_items
  FOR EACH ROW EXECUTE FUNCTION update_purchase_order_total();

CREATE TRIGGER trigger_update_purchase_order_total_on_update
  AFTER UPDATE ON public.purchase_order_items
  FOR EACH ROW EXECUTE FUNCTION update_purchase_order_total();

CREATE TRIGGER trigger_update_purchase_order_total_on_delete
  AFTER DELETE ON public.purchase_order_items
  FOR EACH ROW EXECUTE FUNCTION update_purchase_order_total();
