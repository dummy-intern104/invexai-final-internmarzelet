
import SalesHeader from "@/components/sales/SalesHeader";
import SalesListSection from "@/components/sales/SalesListSection";
import useAppStore from "@/store/appStore";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Sales = () => {
  const navigate = useNavigate();
  const { sales, products, clients } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to access sales');
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteSale = (saleId: number) => {
    // Implementation for deleting sale
    console.log("Delete sale:", saleId);
  };

  const filteredSales = sales.filter(sale =>
    sale.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.sale_id.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SalesHeader 
        productsExist={products.length > 0}
        isRecordSaleOpen={isRecordSaleOpen}
        onOpenRecordSale={() => setIsRecordSaleOpen(true)}
        onCloseRecordSale={() => setIsRecordSaleOpen(false)}
      />
      <SalesListSection 
        sales={filteredSales}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onDeleteSale={handleDeleteSale}
        totalSales={sales.length}
      />
    </div>
  );
};

export default Sales;
