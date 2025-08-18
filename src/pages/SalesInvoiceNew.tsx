import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { InvoiceDialog } from '@/components/sales/InvoiceDialog';
import MainLayout from '@/components/layout/MainLayout';

const SalesInvoiceNew = () => {
  const navigate = useNavigate();

  const handleInvoiceCreated = (invoiceData: any) => {
    console.log("Sales invoice created:", invoiceData);
    navigate("/sales/invoices");
  };

  const handleCancel = () => {
    navigate("/sales/invoices");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sales/invoices")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales Invoices
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Sales Invoice</CardTitle>
            <CardDescription>
              Generate a professional invoice for your customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceDialog 
              open={true}
              onOpenChange={(open) => {
                if (!open) handleCancel();
              }}
              onInvoiceCreated={handleInvoiceCreated}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SalesInvoiceNew;