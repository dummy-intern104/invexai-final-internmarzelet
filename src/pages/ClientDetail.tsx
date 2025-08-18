import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CreditCard, FileText, MessageSquare, Package, Phone, ShoppingCart, Trash, UserPlus } from "lucide-react";
import { LineChart } from "@/components/charts/LineChart";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";
import { CreateEstimateDialog } from "@/components/estimates/CreateEstimateDialog";
import { ScheduleMeetingDialog } from "@/components/clients/ScheduleMeetingDialog";
import { AddProductsDialog } from "@/components/clients/AddProductsDialog";
import { MeetingListDialog } from "@/components/clients/MeetingListDialog";

const ClientDetail = () => {
  const {
    clientId
  } = useParams();
  const navigate = useNavigate();
  const {
    clients,
    removeClient
  } = useAppStore();

  // Dialog states
  const [isEstimateDialogOpen, setIsEstimateDialogOpen] = useState(false);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false);
  const [isMeetingListOpen, setIsMeetingListOpen] = useState(false);

  // Find the client by id
  const client = clients.find(c => c.id.toString() === clientId);
  if (!client) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
        <p className="text-muted-foreground mb-6">The client you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
      </div>;
  }
  const handleDelete = () => {
    removeClient(client.id);
    toast.success("Client deleted successfully");
    navigate('/clients');
  };
  const handleEstimateCreated = (estimateData: any) => {
    console.log("Estimate created for client:", estimateData);
    toast.success(`Estimate created for ${client.name}`);
  };
  const handleMeetingScheduled = (meeting: any) => {
    console.log("Meeting scheduled:", meeting);
    // Meeting is now automatically handled by the store
  };

  // Mock data for charts
  const purchaseData = [{
    name: 'Jan',
    value: 2400
  }, {
    name: 'Feb',
    value: 1398
  }, {
    name: 'Mar',
    value: 9800
  }, {
    name: 'Apr',
    value: 3908
  }, {
    name: 'May',
    value: 4800
  }, {
    name: 'Jun',
    value: 3800
  }];
  const paymentData = [{
    name: 'Jan',
    value: 2000
  }, {
    name: 'Feb',
    value: 1200
  }, {
    name: 'Mar',
    value: 9000
  }, {
    name: 'Apr',
    value: 3500
  }, {
    name: 'May',
    value: 4000
  }, {
    name: 'Jun',
    value: 3000
  }];
  return <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">{client.email}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDelete} className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
            <Trash className="w-4 h-4 mr-1" />
            Delete Client
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{client.phone || "No phone number"}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Client since {client.joinDate}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Total Spent</span>
              </div>
              <span className="font-medium">₹{client.totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Open Invoices</span>
              </div>
              <span className="font-medium">{client.openInvoices || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Last Purchase</span>
              </div>
              <span className="font-medium">{client.lastPurchase || "Never"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsEstimateDialogOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsProductsDialogOpen(true)}>
              <Package className="w-4 h-4 mr-2" />
              Add Products
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsMeetingDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsMeetingListOpen(true)}>
              <Clock className="w-4 h-4 mr-2" />
              View Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Estimate Dialog with prefilled client name */}
      <CreateEstimateDialog open={isEstimateDialogOpen} onOpenChange={setIsEstimateDialogOpen} onEstimateCreated={handleEstimateCreated} prefilledClientName={client.name} />

      {/* Schedule Meeting Dialog */}
      <ScheduleMeetingDialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen} clientId={client.id} clientName={client.name} onMeetingScheduled={handleMeetingScheduled} />

      {/* Add Products Dialog */}
      <AddProductsDialog open={isProductsDialogOpen} onOpenChange={setIsProductsDialogOpen} clientId={client.id} clientName={client.name} />

      {/* Meeting List Dialog */}
      <MeetingListDialog 
        open={isMeetingListOpen} 
        onOpenChange={setIsMeetingListOpen} 
        clientId={client.id} 
        clientName={client.name} 
      />
    </div>;
};
export default ClientDetail;
