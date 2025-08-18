
import { useNavigate } from "react-router-dom";
import useAppStore from "@/store/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProductSelector from "./form/ProductSelector";
import ClientSelector from "./form/ClientSelector";
import SaleDetailsForm from "./form/SaleDetailsForm";
import FormActions from "./form/FormActions";
import { useSaleForm } from "./hooks/useSaleForm";
import { validateSaleData, processSaleSubmission } from "./utils/saleProcessor";

interface RecordSaleFormProps {
  onClose: () => void;
}

const RecordSaleForm = ({
  onClose
}: RecordSaleFormProps) => {
  const navigate = useNavigate();
  const store = useAppStore();
  const {
    products,
    clients,
    recordSale,
    setPendingSalePayment,
    addClient,
    pendingEstimateForSale,
    setPendingEstimateForSale
  } = store;

  console.log("RECORD SALE FORM: Component mounted with estimate data:", pendingEstimateForSale);

  const {
    newSaleData,
    formErrors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleProductChange,
    handleClientChange,
    handleQuantityChange,
    handlePriceChange,
    getEstimateItemsInfo,
    moveToNextEstimateItem
  } = useSaleForm();

  const estimateInfo = getEstimateItemsInfo();

  const handleAddSale = async () => {
    console.log("RECORD SALE FORM: Starting sale recording process");
    console.log("RECORD SALE FORM: Sale data:", newSaleData);
    console.log("RECORD SALE FORM: Estimate ID:", pendingEstimateForSale?.id);

    // Prevent double submissions
    if (isSubmitting) {
      console.log("RECORD SALE FORM: Already submitting, preventing duplicate");
      toast.warning("Sale recording in progress, please wait...");
      return;
    }

    // Validate basic requirements
    if (!recordSale) {
      console.error("RECORD SALE FORM: recordSale function is not available");
      toast.error("Sale recording system is not available. Please refresh the page and try again.");
      return;
    }
    if (typeof recordSale !== 'function') {
      console.error("RECORD SALE FORM: recordSale is not a function, type:", typeof recordSale);
      toast.error("Sale recording function is invalid. Please refresh the page and try again.");
      return;
    }

    // Validate the form
    if (!validateForm()) {
      console.log("RECORD SALE FORM: Form validation failed");
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Validate products availability
    if (!products || products.length === 0) {
      console.error("RECORD SALE FORM: No products available");
      toast.error("No products available. Please add products first.");
      return;
    }

    // Validate sale data and stock
    const validation = validateSaleData(newSaleData, products, recordSale);
    if (!validation.isValid) {
      console.log("RECORD SALE FORM: Sale data validation failed");
      return;
    }
    console.log("RECORD SALE FORM: All validations passed, proceeding with sale recording");
    setIsSubmitting(true);
    try {
      // Add estimate ID to sale data if available
      const saleDataWithEstimate = {
        ...newSaleData,
        estimateId: pendingEstimateForSale?.id
      };
      const result = await processSaleSubmission(saleDataWithEstimate, recordSale);
      if (result.success && result.sale) {
        console.log("RECORD SALE FORM: Sale recorded successfully:", result.sale);

        // Check if this is the last item from an estimate
        const shouldCompleteEstimate = estimateInfo && !estimateInfo.hasMoreItems;
        if (estimateInfo && estimateInfo.hasMoreItems) {
          // Move to next item in estimate
          moveToNextEstimateItem();
          toast.success(`Item ${estimateInfo.currentIndex + 1} of ${estimateInfo.totalItems} recorded! Continue with next item.`);
          setIsSubmitting(false);
          return;
        }

        // Validate setPendingSalePayment function
        if (typeof setPendingSalePayment !== 'function') {
          console.error("RECORD SALE FORM: setPendingSalePayment is not a function");
          toast.error("Cannot proceed to payment. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Store the sale details for the payment page with estimate info
        const saleWithEstimateInfo = {
          ...result.sale,
          estimateId: pendingEstimateForSale?.id,
          isFromEstimate: !!pendingEstimateForSale,
          shouldCompleteEstimate
        };
        setPendingSalePayment(saleWithEstimateInfo);
        console.log("RECORD SALE FORM: Pending sale payment set with estimate info");

        // Clear the pending estimate since we're done with it
        if (shouldCompleteEstimate) {
          setPendingEstimateForSale(null);
        }

        // Show success message
        if (shouldCompleteEstimate) {
          toast.success("All estimate items recorded! Redirecting to payments...");
        } else {
          toast.success("Sale recorded successfully! Redirecting to payments...");
        }

        // Close dialog first
        onClose();

        // Navigate to payments page with a slight delay to ensure dialog closes
        setTimeout(() => {
          console.log("RECORD SALE FORM: Navigating to payments page");
          navigate("/payments");
        }, 100);
      } else {
        console.error("RECORD SALE FORM: Sale recording failed:", result);
        toast.error("Failed to record sale. Please check the details and try again.");
      }
    } catch (error) {
      console.error("RECORD SALE FORM: Unexpected error during sale submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products?.find(p => p.product_id === newSaleData.product_id);

  return (
    <ScrollArea className="h-[80vh]">
      <div className="grid gap-4 py-4 px-2 pr-4">
        {/* Estimate Info Card - Only show if actually from estimate */}
        {pendingEstimateForSale && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="secondary">From Estimate</Badge>
                {pendingEstimateForSale.referenceNo}
              </CardTitle>
              <CardDescription>
                Client: {pendingEstimateForSale.clientName} | Total: ₹{pendingEstimateForSale.totalAmount}
                {estimateInfo && (
                  <span className="ml-2">
                    (Item {estimateInfo.currentIndex + 1} of {estimateInfo.totalItems})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <ProductSelector 
          products={products || []} 
          selectedProductId={newSaleData.product_id} 
          onProductChange={handleProductChange} 
          error={formErrors.product_id} 
          disabled={isSubmitting} 
        />
        
        <ClientSelector 
          clients={clients || []} 
          selectedClientId={newSaleData.clientId} 
          selectedClientName={newSaleData.clientName} 
          onClientChange={handleClientChange} 
          onAddClient={addClient} 
          error={formErrors.clientName} 
          disabled={isSubmitting} 
          isFromEstimate={!!pendingEstimateForSale} 
        />
        
        <SaleDetailsForm 
          quantity={newSaleData.quantity_sold} 
          price={newSaleData.selling_price} 
          maxQuantity={selectedProduct ? parseInt(selectedProduct.units as string) : undefined} 
          onQuantityChange={handleQuantityChange} 
          onPriceChange={handlePriceChange} 
          quantityError={formErrors.quantity_sold} 
          priceError={formErrors.selling_price} 
          disabled={isSubmitting} 
        />
        
        <FormActions 
          onCancel={onClose} 
          onSubmit={handleAddSale} 
          isSubmitting={isSubmitting} 
          submitText={estimateInfo && estimateInfo.hasMoreItems ? `Record Item ${estimateInfo.currentIndex + 1} & Continue` : "Record Sale & Proceed to Payment"} 
        />
      </div>
    </ScrollArea>
  );
};

export default RecordSaleForm;
