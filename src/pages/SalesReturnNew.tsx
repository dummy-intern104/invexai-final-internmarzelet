import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { SalesReturnDialog } from '@/components/sales/SalesReturnDialog';
import MainLayout from '@/components/layout/MainLayout';
import useAppStore from '@/store/appStore';

const SalesReturnNew = () => {
  const navigate = useNavigate();
  const { sales, products, clients } = useAppStore();

  const handleReturnCreated = (returnData: any) => {
    console.log("Sales return created:", returnData);
    navigate("/sales/returns");
  };

  const handleCancel = () => {
    navigate("/sales/returns");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sales/returns")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales Returns
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Sales Return</CardTitle>
            <CardDescription>
              Process a product return and issue refund to customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesReturnDialog 
              open={true}
              onOpenChange={(open) => {
                if (!open) handleCancel();
              }}
              onReturnCreated={handleReturnCreated}
              sales={sales}
              products={products}
              clients={clients}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SalesReturnNew;