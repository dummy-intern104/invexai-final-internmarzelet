
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PurchaseReturnDialog } from "@/components/purchases/PurchaseReturnDialog";

const CreatePurchaseReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleReturnCreated = (returnData: any) => {
    console.log("Purchase return created:", returnData);
    navigate("/purchases/returns");
  };

  const handleCancel = () => {
    navigate("/purchases/returns");
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/purchases/returns")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Purchase Returns
        </Button>
      </div>

      <Card className="max-w-7xl mx-auto">
        <CardContent className="p-0">
          <PurchaseReturnDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleCancel();
            }}
            onReturnCreated={handleReturnCreated}
            isFullScreen={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePurchaseReturn;
