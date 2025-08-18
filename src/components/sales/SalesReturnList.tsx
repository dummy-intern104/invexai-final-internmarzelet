
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, Calendar, User, Trash2, Edit } from 'lucide-react';
import { SalesReturnDialog } from './SalesReturnDialog';
import { useSalesReturns } from './hooks/useSalesReturns';
import { Sale, Product, Client } from '@/types';

interface SalesReturnListProps {
  sales: Sale[];
  products: Product[];
  clients: Client[];
}

export const SalesReturnList = ({ sales, products, clients }: SalesReturnListProps) => {
  const { returns, loading, deleteReturn, updateReturnStatus } = useSalesReturns();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = 
      returnItem.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.return_reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (returnId: string, newStatus: any) => {
    updateReturnStatus(returnId, newStatus);
  };

  const handleDelete = (returnId: string) => {
    if (window.confirm('Are you sure you want to delete this return?')) {
      deleteReturn(returnId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Sales Returns</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          Create Return
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search returns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReturns.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No returns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {returns.length === 0 
              ? "You haven't created any sales returns yet." 
              : "No returns match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReturns.map((returnItem) => (
            <Card key={returnItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{returnItem.product_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={
                        returnItem.status === "completed" ? "default" :
                        returnItem.status === "approved" ? "secondary" :
                        returnItem.status === "rejected" ? "destructive" : "outline"
                      }>
                        {returnItem.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(returnItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{returnItem.client_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(returnItem.return_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Quantity:</strong> {returnItem.return_quantity}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Reason:</strong> {returnItem.return_reason}
                  </div>
                  
                  <div className="text-lg font-semibold pt-2 border-t">
                    Amount: ₹{returnItem.return_amount.toFixed(2)}
                  </div>
                  
                  {returnItem.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(returnItem.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(returnItem.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SalesReturnDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        sales={sales}
        products={products}
        clients={clients}
      />
    </div>
  );
};
