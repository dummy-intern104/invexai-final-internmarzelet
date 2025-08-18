
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { CreateChallanDialog } from "@/components/delivery/CreateChallanDialog";

const CreateChallan = () => {
  const navigate = useNavigate();

  const handleChallanCreated = (challanData: any) => {
    // Get existing challans
    const storedChallans = localStorage.getItem('deliveryChallans');
    let challans = [];
    
    if (storedChallans) {
      try {
        challans = JSON.parse(storedChallans);
      } catch (e) {
        console.error("Error parsing stored challans:", e);
      }
    }

    const newChallan = {
      id: challanData.challanNo || `DC-${Date.now().toString().slice(-6)}`,
      clientName: challanData.clientName,
      date: challanData.date,
      challanNo: challanData.challanNo || `DC-${Date.now().toString().slice(-6)}`,
      deliveryAddress: challanData.deliveryAddress,
      status: challanData.status || "delivered",
      createdAt: challanData.createdAt || new Date().toISOString(),
      items: challanData.items,
      notes: challanData.notes,
      vehicleNo: challanData.vehicleNo,
    };
    
    const updatedChallans = [newChallan, ...challans];
    localStorage.setItem('deliveryChallans', JSON.stringify(updatedChallans));
    
    navigate("/delivery");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/delivery")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Delivery
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Delivery Challan</CardTitle>
            <CardDescription>
              Enter the delivery challan details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateChallanDialog 
              open={true}
              onOpenChange={() => {}}
              onChallanCreated={handleChallanCreated}
              isFullPage={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateChallan;
