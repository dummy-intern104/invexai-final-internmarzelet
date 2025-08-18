
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PurchaseOrderDialog } from "@/components/purchases/PurchaseOrderDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleOrderCreated = async (orderData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to create purchase orders');
        return;
      }

      const { data, error } = await supabase
        .from('purchase_orders')
        .insert({
          user_id: user.id,
          order_number: orderData.orderNumber || `PO-${Date.now().toString().slice(-6)}`,
          supplier_name: orderData.supplierName,
          order_date: orderData.orderDate,
          expected_delivery_date: orderData.expectedDeliveryDate,
          supplier_contact: orderData.supplierContact,
          notes: orderData.notes,
          status: orderData.status || "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Insert purchase order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(
            orderData.items.map((item: any) => ({
              purchase_order_id: data.id,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.total_price || (item.quantity * item.unit_price),
            }))
          );

        if (itemsError) throw itemsError;
      }

      toast.success("Purchase order created successfully");
      navigate("/purchases/orders");
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Failed to create purchase order');
    }
  };

  const handleCancel = () => {
    navigate("/purchases/orders");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/purchases/orders")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Purchase Orders
          </Button>
        </div>

        <Card className="max-w-7xl mx-auto overflow-auto max-h-[90vh]">
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-[80vh]">
              <PurchaseOrderDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  if (!open) handleCancel();
                }}
                onOrderCreated={handleOrderCreated}
                isFullScreen={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
