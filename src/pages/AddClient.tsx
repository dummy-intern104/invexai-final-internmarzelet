
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";

const AddClient = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addClient } = useAppStore();

  const handleAddClient = async (clientData: any) => {
    setIsSubmitting(true);
    try {
      console.log("CLIENT ADD PAGE: Adding new client:", clientData.name);
      
      // Use the app store to add client (which handles Supabase sync)
      await addClient(clientData);
      
      console.log("CLIENT ADD PAGE: Client saved successfully");
      toast.success("Client created successfully");
      
      // Navigate back to clients list
      navigate("/clients");
    } catch (error) {
      console.error("CLIENT ADD PAGE: Error saving client:", error);
      toast.error("Error saving client. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Client</CardTitle>
            <CardDescription>
              Enter the client details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddClientDialog 
              isOpen={true}
              onOpenChange={() => {}}
              onAddClient={handleAddClient}
              isFullPage={true}
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddClient;
