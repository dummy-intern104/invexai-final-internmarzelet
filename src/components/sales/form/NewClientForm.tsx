
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientService } from "@/services/supabaseService";
import { toast } from "sonner";

interface NewClientData {
  name: string;
  email: string;
  phone: string;
}

interface NewClientFormProps {
  onAddClient: (clientData: any) => void;
  disabled: boolean;
}

const NewClientForm = ({ onAddClient, disabled }: NewClientFormProps) => {
  const [newClientData, setNewClientData] = useState<NewClientData>({
    name: "",
    email: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState({
    name: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nameError = !newClientData.name.trim();
    setErrors({ name: nameError });
    return !nameError;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save directly to Supabase clients table
      const supabaseClientData = {
        name: newClientData.name,
        email: newClientData.email || null,
        phone: newClientData.phone || null,
        address: null,
        city: null,
        state: null,
        pincode: null,
        gst_number: null,
      };
      
      const newClient = await clientService.create(supabaseClientData);
      
      // Pass the new client data to parent component
      onAddClient(newClient);
      
      toast.success("Client created successfully");
      
      // Reset form
      setNewClientData({
        name: "",
        email: "",
        phone: "",
      });
      setErrors({ name: false });
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Error creating client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/40 p-4 rounded-md border mt-2">
      <h3 className="text-sm font-medium mb-3">Add New Client</h3>
      <div className="space-y-3">
        <div>
          <Label htmlFor="client-name">Name <span className="text-red-500">*</span></Label>
          <Input
            id="client-name"
            value={newClientData.name}
            onChange={(e) => {
              setNewClientData({...newClientData, name: e.target.value});
              setErrors({...errors, name: !e.target.value.trim()});
            }}
            placeholder="Client name"
            className={errors.name ? "border-red-500" : ""}
            disabled={disabled || isSubmitting}
          />
          {errors.name && (
            <p className="text-xs text-red-500">Client name is required</p>
          )}
        </div>
        <div>
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            value={newClientData.email}
            onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
            placeholder="Email address"
            disabled={disabled || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            value={newClientData.phone}
            onChange={(e) => setNewClientData({...newClientData, phone: e.target.value})}
            placeholder="Phone number"
            disabled={disabled || isSubmitting}
          />
        </div>
        <Button 
          type="button" 
          onClick={handleSubmit}
          className="w-full"
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Client"}
        </Button>
      </div>
    </div>
  );
};

export default NewClientForm;
