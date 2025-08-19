
-- Phase 1: Fix Database Structure
-- Add foreign key relationships between sales and clients/products tables

-- First, let's add the missing foreign key constraints
-- Note: We need to ensure existing data doesn't violate these constraints

-- Add foreign key from sales to clients
ALTER TABLE public.sales 
ADD CONSTRAINT sales_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- Add foreign key from sales to products  
ALTER TABLE public.sales
ADD CONSTRAINT sales_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- Add foreign key from payments to clients
ALTER TABLE public.payments
ADD CONSTRAINT payments_client_id_fkey
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- Phase 2: Add Sample Data
-- Insert sample clients first (since sales will reference them)
INSERT INTO public.clients (id, user_id, name, email, phone, address, city, state, pincode, gst_number) VALUES
('11111111-1111-1111-1111-111111111111', auth.uid(), 'ABC Electronics Pvt Ltd', 'contact@abcelectronics.com', '+91 98765 43210', '123 Business Park, Sector 18', 'Gurgaon', 'Haryana', '122015', '07ABCDE1234F1Z5'),
('22222222-2222-2222-2222-222222222222', auth.uid(), 'XYZ Traders', 'info@xyztraders.com', '+91 87654 32109', '456 Market Street', 'Mumbai', 'Maharashtra', '400001', '27XYZAB5678C2D3'),
('33333333-3333-3333-3333-333333333333', auth.uid(), 'Tech Solutions Ltd', 'sales@techsolutions.com', '+91 76543 21098', '789 IT Hub', 'Bangalore', 'Karnataka', '560001', '29TECH567890E1F2'),
('44444444-4444-4444-4444-444444444444', auth.uid(), 'Global Imports', 'orders@globalimports.in', '+91 65432 10987', '321 Import House', 'Delhi', 'Delhi', '110001', '07GLBIM1234G3H4'),
('55555555-5555-5555-5555-555555555555', auth.uid(), 'Retail Chain Store', 'purchase@retailchain.com', '+91 54321 09876', '654 Retail Plaza', 'Chennai', 'Tamil Nadu', '600001', '33RETL567890I5J6');

-- Insert sample products
INSERT INTO public.products (id, user_id, product_name, category, price, units, reorder_level, expiry_date, supplier_company_name, supplier_gst_number) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', auth.uid(), 'Samsung Galaxy S24', 'Electronics', 75000, 'piece', 5, NULL, 'Samsung India Electronics', '07SAMSG1234H1I2'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', auth.uid(), 'Apple iPhone 15', 'Electronics', 85000, 'piece', 3, NULL, 'Apple India Pvt Ltd', '27APPLE5678J2K3'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', auth.uid(), 'Dell Laptop Inspiron', 'Electronics', 55000, 'piece', 8, NULL, 'Dell Technologies India', '29DELL567890L3M4'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', auth.uid(), 'HP Printer LaserJet', 'Electronics', 25000, 'piece', 10, NULL, 'HP India Sales Pvt Ltd', '07HPIND1234N4O5'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', auth.uid(), 'Sony Headphones WH-1000XM4', 'Electronics', 15000, 'piece', 15, NULL, 'Sony India Pvt Ltd', '27SONY567890P5Q6'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', auth.uid(), 'Paracetamol 500mg', 'Medicine', 50, 'strip', 100, '2025-12-31', 'PharmaCorp India Ltd', '29PHARM12345R6S7'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', auth.uid(), 'Vitamin D3 Tablets', 'Medicine', 250, 'bottle', 50, '2026-06-30', 'HealthSupp Pvt Ltd', '33HLTH567890T7U8');

-- Insert inventory records for products
INSERT INTO public.inventory (user_id, product_id, current_stock, warehouse_stock, local_stock, reserved_stock, reorder_level, product_name, location) VALUES
(auth.uid(), 1, 25, 15, 10, 0, 5, 'Samsung Galaxy S24', 'main'),
(auth.uid(), 2, 18, 12, 6, 0, 3, 'Apple iPhone 15', 'main'),
(auth.uid(), 3, 32, 20, 12, 0, 8, 'Dell Laptop Inspiron', 'main'),
(auth.uid(), 4, 45, 30, 15, 0, 10, 'HP Printer LaserJet', 'main'),
(auth.uid(), 5, 60, 40, 20, 0, 15, 'Sony Headphones WH-1000XM4', 'main'),
(auth.uid(), 6, 500, 300, 200, 0, 100, 'Paracetamol 500mg', 'main'),
(auth.uid(), 7, 150, 100, 50, 0, 50, 'Vitamin D3 Tablets', 'main');

-- Insert sample sales records with proper relationships
INSERT INTO public.sales (id, user_id, product_id, client_id, quantity_sold, selling_price, total_amount, sale_date, payment_method, notes) VALUES
('s1111111-1111-1111-1111-111111111111', auth.uid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 2, 75000, 150000, '2024-08-19 10:30:00+00', 'bank_transfer', 'Corporate bulk order'),
('s2222222-2222-2222-2222-222222222222', auth.uid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 1, 85000, 85000, '2024-08-19 14:15:00+00', 'cash', 'Walk-in customer'),
('s3333333-3333-3333-3333-333333333333', auth.uid(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 3, 55000, 165000, '2024-08-18 09:45:00+00', 'upi', 'Office setup order'),
('s4444444-4444-4444-4444-444444444444', auth.uid(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 5, 25000, 125000, '2024-08-18 16:20:00+00', 'bank_transfer', 'Printing solution'),
('s5555555-5555-5555-5555-555555555555', auth.uid(), 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 10, 15000, 150000, '2024-08-17 11:00:00+00', 'card', 'Retail chain order'),
('s6666666-6666-6666-6666-666666666666', auth.uid(), 'ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 50, 50, 2500, '2024-08-19 08:30:00+00', 'cash', 'Medical supplies'),
('s7777777-7777-7777-7777-777777777777', auth.uid(), 'gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 20, 250, 5000, '2024-08-17 15:45:00+00', 'upi', 'Health supplements');

-- Insert sample payments
INSERT INTO public.payments (id, user_id, client_id, amount, payment_date, payment_method, reference_number, notes, status) VALUES
('p1111111-1111-1111-1111-111111111111', auth.uid(), '11111111-1111-1111-1111-111111111111', 152500, '2024-08-19 11:00:00+00', 'bank_transfer', 'TXN123456789', 'Payment for Samsung phones + medicines', 'completed'),
('p2222222-2222-2222-2222-222222222222', auth.uid(), '22222222-2222-2222-2222-222222222222', 85000, '2024-08-19 14:30:00+00', 'cash', 'CASH001', 'iPhone purchase payment', 'completed'),
('p3333333-3333-3333-3333-333333333333', auth.uid(), '33333333-3333-3333-3333-333333333333', 165000, '2024-08-18 10:00:00+00', 'upi', 'UPI789123456', 'Dell laptop payment', 'completed'),
('p4444444-4444-4444-4444-444444444444', auth.uid(), '44444444-4444-4444-4444-444444444444', 125000, '2024-08-18 16:45:00+00', 'bank_transfer', 'TXN987654321', 'HP printer payment', 'completed'),
('p5555555-5555-5555-5555-555555555555', auth.uid(), '55555555-5555-5555-5555-555555555555', 155000, '2024-08-17 12:00:00+00', 'card', 'CARD456789123', 'Headphones + supplements', 'completed');

-- Insert product expiry records
INSERT INTO public.product_expiry (user_id, product_id, product_name, expiry_date, batch_number, quantity, status, notes) VALUES
(auth.uid(), 6, 'Paracetamol 500mg', '2025-12-31', 'PCM2024-001', 500, 'active', 'Main stock batch'),
(auth.uid(), 7, 'Vitamin D3 Tablets', '2026-06-30', 'VTD-2024-002', 150, 'active', 'Fresh import batch'),
(auth.uid(), 6, 'Paracetamol 500mg', '2025-03-15', 'PCM2024-EXP', 25, 'active', 'Expiring soon - priority sale'),
(auth.uid(), 7, 'Vitamin D3 Tablets', '2025-01-31', 'VTD-2023-003', 10, 'active', 'Old batch - discount sale');
