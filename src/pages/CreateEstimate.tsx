
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { CreateEstimateDialog } from "@/components/estimates/CreateEstimateDialog";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateEstimate = () => {
  const navigate = useNavigate();

  const handleEstimateCreated = async (estimateData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to create estimates');
        return;
      }

      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: user.id,
          estimate_number: estimateData.referenceNo || `EST-${Date.now().toString().slice(-6)}`,
          client_name: estimateData.clientName,
          date: estimateData.date,
          total_amount: estimateData.totalAmount || 0,
          status: estimateData.status || "pending",
          valid_until: estimateData.validUntil,
          notes: estimateData.notes,
          terms: estimateData.terms,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert estimate items if provided
      if (estimateData.items && estimateData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('estimate_items')
          .insert(
            estimateData.items.map((item: any) => ({
              estimate_id: data.id,
              product_name: item.product_name,
              quantity: item.quantity,
              price: item.price,
              total: item.total || (item.quantity * item.price),
            }))
          );

        if (itemsError) throw itemsError;
      }

      toast.success("Estimate created successfully");
      navigate("/estimates");
    } catch (error) {
      console.error('Error creating estimate:', error);
      toast.error('Failed to create estimate');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/estimates")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Estimates
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Estimate</CardTitle>
            <CardDescription>
              Enter the estimate details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateEstimateDialog 
              open={true}
              onOpenChange={() => {}}
              onEstimateCreated={handleEstimateCreated}
              isFullPage={true}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateEstimate;
