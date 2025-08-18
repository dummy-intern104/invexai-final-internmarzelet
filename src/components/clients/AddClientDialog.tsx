
import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import GSTLookupSection from "../payments/form/GSTLookupSection";

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClient: (client: Omit<Client, "id" | "totalPurchases" | "totalSpent" | "lastPurchase">) => void;
  isFullPage?: boolean;
  disabled?: boolean;
}

export const AddClientDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddClient,
  isFullPage = false,
  disabled = false
}: AddClientDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [isGSTLoading, setIsGSTLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleGSTDetailsUpdate = (details: {
    companyName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...details
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    };
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    console.log("CLIENT DIALOG: Submitting client data:", formData.name);
    
    onAddClient({
      ...formData,
      joinDate: new Date().toISOString(),
      openInvoices: 0,
      purchaseHistory: []
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstNumber: "",
      companyName: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    });
    
    if (!isFullPage) {
      onOpenChange(false);
    }
  };

  const FormContent = () => (
    <div className="grid gap-4 py-4">
      {/* Client Basic Details */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter client's full name"
          className={errors.name ? "border-red-500" : ""}
          disabled={disabled}
        />
        {errors.name && (
          <p className="text-xs text-red-500">Client name is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter client's email"
          className={errors.email ? "border-red-500" : ""}
          disabled={disabled}
        />
        {errors.email && (
          <p className="text-xs text-red-500">Please enter a valid email address</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter client's phone number"
          disabled={disabled}
        />
      </div>

      {/* GST Section with Address and Company Name */}
      <GSTLookupSection
        gstNumber={formData.gstNumber}
        companyName={formData.companyName}
        address={formData.address}
        city={formData.city}
        state={formData.state}
        pincode={formData.pincode}
        onChange={handleChange}
        onGSTDetailsUpdate={handleGSTDetailsUpdate}
        error={false}
        isLoading={isGSTLoading}
        setIsLoading={setIsGSTLoading}
        disabled={disabled}
      />
    </div>
  );

  const FormActions = () => (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => onOpenChange(false)}
        className="w-full sm:w-auto"
        disabled={disabled}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleSubmit}
        className="w-full sm:w-auto"
        disabled={disabled || isGSTLoading}
      >
        <User className="mr-2 h-4 w-4" /> 
        {disabled ? "Saving..." : "Add Client"}
      </Button>
    </DialogFooter>
  );

  if (isFullPage) {
    return (
      <div className="space-y-6">
        <FormContent />
        <FormActions />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the details for the new client below.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
        <FormActions />
      </DialogContent>
    </Dialog>
  );
};
