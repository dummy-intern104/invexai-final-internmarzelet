-- Create the missing update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create keyboard_shortcuts table for storing user keyboard shortcuts
CREATE TABLE public.keyboard_shortcuts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  shortcut_key text NOT NULL,
  description text NOT NULL,
  action text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, shortcut_key)
);

-- Enable Row Level Security
ALTER TABLE public.keyboard_shortcuts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own keyboard shortcuts" 
ON public.keyboard_shortcuts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own keyboard shortcuts" 
ON public.keyboard_shortcuts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keyboard shortcuts" 
ON public.keyboard_shortcuts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keyboard shortcuts" 
ON public.keyboard_shortcuts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_keyboard_shortcuts_updated_at
BEFORE UPDATE ON public.keyboard_shortcuts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();