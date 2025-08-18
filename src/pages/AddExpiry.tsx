
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { AddExpiryDialog } from "@/components/expiry/AddExpiryDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

interface SupabaseProduct {
  id: string;
  product_name: string;
  category: string;
  price: number;
  units: string;
  reorder_level: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  expiry_date?: string;
  supplier_company_name?: string;
  supplier_gst_number?: string;
  supplier_address?: string;
  supplier_city?: string;
  supplier_state?: string;
  supplier_pincode?: string;
}

const AddExpiry = () => {
  const navigate = useNavigate();

  // Fetch products from Supabase
  const { data: supabaseProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('product_name');
      
      if (error) throw error;
      return data as SupabaseProduct[] || [];
    }
  });

  // Convert Supabase products to the format expected by AddExpiryDialog
  const products = supabaseProducts.map(product => ({
    id: product.id,
    product_id: parseInt(product.id.slice(-8), 16), // Generate numeric ID for compatibility
    product_name: product.product_name,
    category: product.category,
    price: product.price,
    units: product.units,
    reorder_level: product.reorder_level,
    created_at: product.created_at,
    user_id: product.user_id,
    expiry_date: product.expiry_date
  }));

  const handleAddExpiry = async (expiryData: any) => {
    try {
      const selectedSupabaseProduct = supabaseProducts.find(p => 
        parseInt(p.id.slice(-8), 16) === expiryData.product_id
      );
      
      if (!selectedSupabaseProduct) {
        toast.error("Selected product not found");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add expiry records");
        return;
      }

      const { error } = await supabase
        .from('product_expiry')
        .insert({
          user_id: user.id,
          product_id: parseInt(selectedSupabaseProduct.id.slice(-8), 16),
          product_name: selectedSupabaseProduct.product_name,
          expiry_date: expiryData.expiry_date,
          batch_number: expiryData.batch_number || null,
          quantity: expiryData.quantity,
          status: 'active',
          notes: expiryData.notes || null
        });

      if (error) throw error;

      toast.success("Product expiry record added successfully");
      navigate("/expiry");
    } catch (error) {
      console.error('Error adding product expiry:', error);
      toast.error("Failed to add product expiry record");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/expiry")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expiry
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add Product Expiry</CardTitle>
            <CardDescription>
              Enter the product expiry details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddExpiryDialog
              open={true}
              onOpenChange={() => {}}
              onAddExpiry={handleAddExpiry}
              products={products}
              isFullPage={true}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddExpiry;
