
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Package, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductExpiry {
  id: string;
  user_id: string;
  product_id: number;
  product_name: string;
  expiry_date: string;
  batch_number?: string;
  quantity: number;
  status: 'active' | 'expired' | 'disposed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

const Expiry = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch expired products from Supabase
  const { data: productExpiries = [], isLoading, refetch } = useQuery({
    queryKey: ['expired-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_expiry')
        .select('*')
        .order('expiry_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const getDaysExpired = (expiredDate: string) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = today.getTime() - expiry.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter expired products
  const expiredProducts = productExpiries.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const today = new Date();
    const expiryDate = new Date(product.expiry_date);
    const isExpired = product.status === 'active' && expiryDate < today;
    return matchesSearch && isExpired && product.quantity > 0;
  });

  const handleDisposeProduct = async (productId: string, productName: string) => {
    try {
      const { error } = await supabase
        .from('product_expiry')
        .update({ status: 'disposed', updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;
      
      toast.success(`${productName} marked for disposal`);
      refetch();
    } catch (error) {
      console.error('Error disposing product:', error);
      toast.error(`Failed to dispose ${productName}`);
    }
  };

  const handleClearanceAction = (productId: string, productName: string) => {
    toast.success(`${productName} marked for clearance sale`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            Expired Products
          </h1>
          <p className="text-muted-foreground">
            Products that have exceeded their expiry date
          </p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 mx-[50px] py-[8px] my-0">
          {expiredProducts.length} Items
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search expired products..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {/* Alert Banner */}
      {expiredProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Action Required: {expiredProducts.length} expired products need immediate attention
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expiredProducts.map(product => {
          const daysExpired = getDaysExpired(product.expiry_date);
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                  </div>
                  <Badge variant="secondary">Expired</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expired:</span>
                    <span className="text-sm font-medium text-red-600">
                      {new Date(product.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Expired:</span>
                    <Badge variant="destructive">
                      {daysExpired} days ago
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stock:</span>
                    <span className="text-sm">{product.quantity} units</span>
                  </div>
                  {product.batch_number && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Batch:</span>
                      <span className="text-sm">{product.batch_number}</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleClearanceAction(product.id, product.product_name)} 
                      className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      Clearance
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDisposeProduct(product.id, product.product_name)} 
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Dispose
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {expiredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Expired Products</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "No expired products match your search criteria." : "No products have expired. Great inventory management!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Expiry;
