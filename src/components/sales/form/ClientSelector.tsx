
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import NewClientForm from "./NewClientForm";

interface Client {
  id: number;
  name: string;
}

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: number;
  selectedClientName: string;
  onClientChange: (clientId: number, clientName: string) => void;
  onAddClient: (clientData: { name: string; email: string; phone: string; joinDate: string; openInvoices: number }) => void;
  error: boolean;
  disabled: boolean;
  isFromEstimate?: boolean;
}

const ClientSelector = ({ 
  clients, 
  selectedClientId, 
  selectedClientName,
  onClientChange, 
  onAddClient,
  error, 
  disabled,
  isFromEstimate = false
}: ClientSelectorProps) => {
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const handleClientSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = parseInt(e.target.value);
    const selectedClient = clients.find((c) => c.id === clientId);
    
    if (e.target.value === "new") {
      setShowNewClientForm(true);
      return;
    }
    
    onClientChange(clientId, selectedClient?.name || "");
    
    // Hide new client form if a client is selected
    if (clientId > 0) {
      setShowNewClientForm(false);
    }
  };

  const handleAddNewClient = (clientData: { name: string; email: string; phone: string }) => {
    const fullClientData = {
      ...clientData,
      joinDate: new Date().toISOString(),
      openInvoices: 0
    };
    
    onAddClient(fullClientData);
    onClientChange(0, clientData.name);
    setShowNewClientForm(false);
  };

  // Find selected client value for the dropdown
  const getSelectedValue = () => {
    if (selectedClientId) return selectedClientId.toString();
    if (selectedClientName && !selectedClientId) {
      // Check if client name matches any existing client
      const matchingClient = clients.find(c => 
        c.name.toLowerCase().trim() === selectedClientName.toLowerCase().trim()
      );
      return matchingClient ? matchingClient.id.toString() : "";
    }
    return "";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="client">
        Client <span className="text-red-500">*</span>
        {isFromEstimate && (
          <span className="text-sm text-muted-foreground ml-2">(from estimate)</span>
        )}
      </Label>
      <div className="flex gap-2">
        <select
          id="client"
          className={`flex h-10 w-full rounded-md border ${error ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          onChange={handleClientSelectChange}
          value={getSelectedValue()}
          disabled={disabled}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option 
              key={client.id} 
              value={client.id}
            >
              {client.name}
            </option>
          ))}
          <option value="new">➕ Add New Client</option>
        </select>
        
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={() => setShowNewClientForm(!showNewClientForm)}
          disabled={disabled}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-500">Client selection is required</p>
      )}
      
      {/* Show client name if from estimate and not found in clients list */}
      {isFromEstimate && selectedClientName && !selectedClientId && (
        <p className="text-xs text-blue-600">
          Using client from estimate: {selectedClientName}
        </p>
      )}
      
      {showNewClientForm && (
        <NewClientForm 
          onAddClient={handleAddNewClient}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ClientSelector;
