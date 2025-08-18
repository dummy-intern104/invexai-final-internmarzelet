
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { SupplierDialog } from "@/components/suppliers/SupplierDialog";

const CreateSupplier = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleSupplierCreated = (supplierData: any) => {
    console.log("Supplier created:", supplierData);
    navigate("/purchases/suppliers");
  };

  const handleCancel = () => {
    navigate("/purchases/suppliers");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/purchases/suppliers")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Suppliers
          </Button>
        </div>

        <Card className="max-w-7xl mx-auto">
          <CardContent className="p-0">
            <SupplierDialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (!open) handleCancel();
              }}
              onSupplierCreated={handleSupplierCreated}
              isFullScreen={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSupplier;
