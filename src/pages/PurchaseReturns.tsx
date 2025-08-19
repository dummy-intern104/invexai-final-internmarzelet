
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Package, DollarSign, Calendar, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PurchaseReturnDialog } from "@/components/purchases/PurchaseReturnDialog";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "sonner";

interface PurchaseReturn {
  id: string;
  supplier_name: string;
  product_name: string;
  quantity: number;
  amount: number;
  return_date: string;
  reason: string;
  status: string;
}

const PurchaseReturns = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReturns = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.purchaseReturns.getAll();
      setReturns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading purchase returns:', error);
      toast.error('Failed to load purchase returns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleCreateReturn = async (returnData: any) => {
    try {
      await supabaseService.purchaseReturns.create(returnData);
      await loadReturns();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating purchase return:', error);
      toast.error('Failed to create purchase return');
    }
  };

  const handleDeleteReturn = async (returnId: string) => {
    try {
      await supabaseService.purchaseReturns.delete(returnId);
      await loadReturns();
    } catch (error) {
      console.error('Error deleting purchase return:', error);
      toast.error('Failed to delete purchase return');
    }
  };

  const totalReturns = Array.isArray(returns) ? returns.length : 0;
  const totalAmount = Array.isArray(returns) ? 
    returns.reduce((sum, ret) => sum + (ret.amount || 0), 0) : 0;
  const pendingReturns = Array.isArray(returns) ? 
    returns.filter(ret => ret.status === 'pending').length : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/purchases")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchases
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchase Returns</h1>
            <p className="text-muted-foreground mt-1">
              Manage returns and refunds for purchased items
            </p>
          </div>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Return
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReturns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReturns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3%</div>
          </CardContent>
        </Card>
      </div>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Returns</CardTitle>
          <CardDescription>
            A list of your recent purchase returns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : totalReturns === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No purchase returns</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating your first purchase return.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Return
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {returns.map((returnItem) => (
                    <tr key={returnItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {returnItem.supplier_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {returnItem.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {returnItem.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ₹{returnItem.amount?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(returnItem.return_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={returnItem.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {returnItem.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReturn(returnItem.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <PurchaseReturnDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateReturn}
      />
    </div>
  );
};

export default PurchaseReturns;
