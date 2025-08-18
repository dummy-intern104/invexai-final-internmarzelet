
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ExpiryHeader } from "@/components/expiry/ExpiryHeader";
import { ExpiryStats } from "@/components/expiry/ExpiryStats";
import { ExpiryTable } from "@/components/expiry/ExpiryTable";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductExpiry } from "@/types";

const Expiry = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch product expiries from Supabase
  const { data: rawProductExpiries = [], isLoading, refetch } = useQuery({
    queryKey: ['product-expiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_expiry')
        .select('*')
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Convert the raw data to properly typed ProductExpiry objects
  const productExpiries: ProductExpiry[] = rawProductExpiries.map(item => ({
    ...item,
    status: (item.status as 'active' | 'expired' | 'disposed') || 'active'
  }));

  // Set initial filter based on URL parameter
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'expiring') {
      setStatusFilter('expiring');
    } else if (filterParam === 'expired') {
      setStatusFilter('expired');
    }
  }, [searchParams]);

  const handleAddExpiry = () => {
    navigate("/expiry/add");
  };

  const handleUpdateExpiry = async (id: string, updates: Partial<ProductExpiry>) => {
    try {
      const { error } = await supabase
        .from('product_expiry')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Product expiry updated successfully");
      refetch();
    } catch (error) {
      console.error('Error updating product expiry:', error);
      toast.error("Failed to update product expiry");
    }
  };

  const handleDeleteExpiry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_expiry')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Product expiry deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting product expiry:', error);
      toast.error("Failed to delete product expiry");
    }
  };

  // Filter expiries based on search and status
  const filteredExpiries = productExpiries.filter(expiry => {
    const matchesSearch = expiry.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (expiry.batch_number && expiry.batch_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    
    if (statusFilter === "expiring") {
      // Show products expiring within 7 days but not yet expired
      const today = new Date();
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);
      const expiryDate = new Date(expiry.expiry_date);
      matchesStatus = expiry.status === 'active' && expiryDate >= today && expiryDate <= next7Days;
    } else if (statusFilter === "expired") {
      // Show expired products
      const today = new Date();
      const expiryDate = new Date(expiry.expiry_date);
      matchesStatus = expiry.status === 'active' && expiryDate < today;
    } else if (statusFilter !== "all") {
      matchesStatus = expiry.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExpiryHeader 
        onAddExpiry={handleAddExpiry}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      
      <ExpiryStats expiries={productExpiries} />
      
      <ExpiryTable 
        expiries={filteredExpiries}
        onUpdateExpiry={handleUpdateExpiry}
        onDeleteExpiry={handleDeleteExpiry}
      />
    </div>
  );
};

export default Expiry;
