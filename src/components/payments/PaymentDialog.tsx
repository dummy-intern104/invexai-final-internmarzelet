
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Client, Sale } from "@/types";
import PaymentClientSection from "./form/PaymentClientSection";
import PaymentDetailsSection from "./form/PaymentDetailsSection";
import GSTLookupSection from "./form/GSTLookupSection";
import { PaymentFormData, PaymentFormErrors } from "./form/types";
import { useSecureForm } from "@/hooks/useSecureForm";
import { validatePaymentData } from "@/utils/validationUtils";
import useAppStore from "@/store/appStore";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PaymentFormData) => void;
  onCancel: () => void;
  clients: Client[];
  pendingSalePayment?: Sale | null;
  isFullPage?: boolean;
}

const PaymentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  clients,
  pendingSalePayment,
  isFullPage = false
}: PaymentDialogProps) => {
  const { currentUser } = useAppStore();
  
  const [formData, setFormData] = useState<PaymentFormData>({
    clientName: pendingSalePayment?.clientName || "",
    amount: pendingSalePayment?.selling_price || 0,
    status: "paid" as const,
    method: "",
    description: pendingSalePayment?.product?.product_name || "",
    relatedSaleId: pendingSalePayment?.sale_id,
    gstNumber: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState<PaymentFormErrors>({
    clientName: false,
    amount: false,
    method: false,
    description: false,
    gstNumber: false
  });

  const [isGSTLoading, setIsGSTLoading] = useState(false);

  const {
    handleSubmit: secureSubmit,
    isSubmitting,
    errors: validationErrors
  } = useSecureForm({
    validateFn: validatePaymentData,
    onSubmit: async sanitizedData => {
      onSubmit(sanitizedData);
      handleClose();
    },
    rateLimitAction: 'payment_creation',
    userId: currentUser?.id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    secureSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof PaymentFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
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

  const handleClose = () => {
    setFormData({
      clientName: "",
      amount: 0,
      status: "paid",
      method: "",
      description: "",
      relatedSaleId: undefined,
      gstNumber: "",
      companyName: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    });
    setErrors({
      clientName: false,
      amount: false,
      method: false,
      description: false,
      gstNumber: false
    });
    onClose();
  };

  useEffect(() => {
    if (pendingSalePayment) {
      setFormData(prev => ({
        ...prev,
        clientName: pendingSalePayment.clientName || "",
        amount: pendingSalePayment.selling_price || 0,
        description: pendingSalePayment.product?.product_name || "",
        relatedSaleId: pendingSalePayment.sale_id
      }));
    }
  }, [pendingSalePayment]);

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <ul className="text-sm text-red-600">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Client Section */}
      <PaymentClientSection 
        clientName={formData.clientName} 
        clients={clients} 
        onChange={handleChange} 
        error={errors.clientName} 
      />
      
      {/* GST Section - positioned between client and description */}
      <GSTLookupSection
        gstNumber={formData.gstNumber}
        companyName={formData.companyName}
        address={formData.address}
        city={formData.city}
        state={formData.state}
        pincode={formData.pincode}
        onChange={handleChange}
        onGSTDetailsUpdate={handleGSTDetailsUpdate}
        error={errors.gstNumber}
        isLoading={isGSTLoading}
        setIsLoading={setIsGSTLoading}
      />
      
      {/* Payment Details Section */}
      <PaymentDetailsSection 
        description={formData.description} 
        amount={formData.amount} 
        method={formData.method} 
        status={formData.status} 
        onChange={handleChange} 
        errors={{
          description: errors.description,
          amount: errors.amount,
          method: errors.method
        }} 
      />
      
      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Payment"}
        </Button>
      </div>
    </form>
  );

  if (isFullPage) {
    return <FormContent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
