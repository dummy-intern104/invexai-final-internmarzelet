
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import PaymentDialog from "@/components/payments/PaymentDialog";
import useAppStore from "@/store/appStore";
import MainLayout from "@/components/layout/MainLayout";

const AddPayment = () => {
  const navigate = useNavigate();
  const { 
    addPayment, 
    clients, 
    pendingSalePayment, 
    setPendingSalePayment 
  } = useAppStore();

  const updateEstimateStatus = (estimateId: string, newStatus: "pending" | "accepted" | "rejected" | "completed") => {
    console.log("Updating estimate status in localStorage:", estimateId, "to", newStatus);
    
    try {
      const storedEstimates = localStorage.getItem('estimates');
      if (storedEstimates) {
        const estimates = JSON.parse(storedEstimates);
        const updatedEstimates = estimates.map((est: any) => 
          est.id === estimateId ? { ...est, status: newStatus } : est
        );
        
        localStorage.setItem('estimates', JSON.stringify(updatedEstimates));
        console.log("Estimate status updated successfully in localStorage");
      }
    } catch (error) {
      console.error("Error updating estimate status:", error);
    }
  };

  const handleSubmitPayment = (formData: any) => {
    // Add payment
    addPayment({
      ...formData,
    });
    
    // Check if this payment is for an estimate-based sale
    if (pendingSalePayment?.estimateId && pendingSalePayment?.shouldCompleteEstimate) {
      console.log("Payment completed for estimate:", pendingSalePayment.estimateId);
      updateEstimateStatus(pendingSalePayment.estimateId, "completed");
    }
    
    // Clear pending sale payment
    if (pendingSalePayment) {
      setPendingSalePayment(null);
    }
    
    // Navigate back
    navigate("/payments");
  };

  const handleCancel = () => {
    // Clear pending sale reference when canceling
    if (pendingSalePayment) {
      setPendingSalePayment(null);
    }
    navigate("/payments");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/payments")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Payment</CardTitle>
            <CardDescription>
              Enter the payment details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentDialog 
              isOpen={true}
              onClose={() => {}}
              onSubmit={handleSubmitPayment}
              clients={clients}
              pendingSalePayment={pendingSalePayment}
              onCancel={handleCancel}
              isFullPage={true}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddPayment;
