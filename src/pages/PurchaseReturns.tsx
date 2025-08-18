
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Package, TrendingDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { purchaseReturnService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';

const PurchaseReturns = () => {
  const navigate = useNavigate();

  const { data: purchaseReturns = [], isLoading } = useQuery({
    queryKey: ['purchase-returns'],
    queryFn: purchaseReturnService.getAll,
  });

  const columns = [
    {
      accessorKey: 'return_number',
      header: 'Return Number',
    },
    {
      accessorKey: 'suppliers',
      header: 'Supplier',
      cell: ({ row }: any) => row.original.suppliers?.supplier_name || 'N/A',
    },
    {
      accessorKey: 'return_date',
      header: 'Return Date',
      cell: ({ row }: any) => format(new Date(row.getValue('return_date')), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'total_amount',
      header: 'Total Amount',
      cell: ({ row }: any) => `₹${Number(row.getValue('total_amount')).toLocaleString()}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status') as string;
        return (
          <Badge 
            variant={status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }: any) => row.getValue('reason') || 'N/A',
    },
  ];

  const totalReturns = purchaseReturns.length;
  const totalAmount = purchaseReturns.reduce((sum, ret) => sum + Number(ret.total_amount || 0), 0);
  const pendingReturns = purchaseReturns.filter(ret => ret.status === 'pending').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading purchase returns...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Returns</h1>
          <p className="text-muted-foreground">Manage supplier returns and refunds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Link to="/purchases/returns/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Return
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReturns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Return</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalReturns > 0 ? Math.round(totalAmount / totalReturns).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Returns</CardTitle>
          <CardDescription>
            All supplier returns and refund requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={purchaseReturns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseReturns;
