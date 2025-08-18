
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import RecordSaleForm from "@/components/sales/RecordSaleForm";
import useAppStore from "@/store/appStore";

const RecordSale = () => {
  const navigate = useNavigate();
  const { pendingEstimateForSale, setPendingEstimateForSale } = useAppStore();

  const handleClose = () => {
    if (pendingEstimateForSale) {
      setPendingEstimateForSale(null);
    }
    navigate("/sales");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Record New Sale</CardTitle>
            <CardDescription>
              {pendingEstimateForSale 
                ? `Recording sale for estimate ${pendingEstimateForSale.referenceNo}`
                : "Enter the details for the new sale below."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordSaleForm onClose={handleClose} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordSale;
