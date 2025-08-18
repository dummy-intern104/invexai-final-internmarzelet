
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";

interface SaleFormData {
  product_id: number;
  quantity_sold: number;
  selling_price: number;
  clientId: number;
  clientName: string;
}

interface FormErrors {
  product_id: boolean;
  quantity_sold: boolean;
  selling_price: boolean;
  clientName: boolean;
}

export const useSaleForm = () => {
  const { pendingEstimateForSale, products, clients } = useAppStore();
  
  const [newSaleData, setNewSaleData] = useState<SaleFormData>({
    product_id: 0,
    quantity_sold: 1,
    selling_price: 0,
    clientId: 0,
    clientName: "",
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    product_id: false,
    quantity_sold: false,
    selling_price: false,
    clientName: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEstimateItem, setCurrentEstimateItem] = useState(0);

  // Initialize form based on whether we have estimate data or not
  useEffect(() => {
    console.log("SALE FORM: Initializing form", { 
      hasEstimate: !!pendingEstimateForSale,
      estimateId: pendingEstimateForSale?.id 
    });

    if (pendingEstimateForSale && pendingEstimateForSale.items && pendingEstimateForSale.items.length > 0) {
      const currentItem = pendingEstimateForSale.items[currentEstimateItem] || pendingEstimateForSale.items[0];
      
      // Find product by name to get product_id
      const matchedProduct = products.find(p => 
        p.product_name.toLowerCase().trim() === currentItem.name.toLowerCase().trim()
      );

      // Find client by name to get client ID
      const matchedClient = clients.find(c => 
        c.name.toLowerCase().trim() === pendingEstimateForSale.clientName.toLowerCase().trim()
      );

      console.log("SALE FORM: Setting up estimate-based sale", {
        itemName: currentItem.name,
        matchedProduct: matchedProduct?.product_name,
        productId: matchedProduct?.product_id,
        clientName: pendingEstimateForSale.clientName,
        matchedClient: matchedClient?.name,
        clientId: matchedClient?.id
      });

      setNewSaleData({
        product_id: matchedProduct?.product_id || 0,
        quantity_sold: currentItem.quantity || 1,
        selling_price: currentItem.price || 0,
        clientId: matchedClient?.id || 0,
        clientName: pendingEstimateForSale.clientName || "",
      });
    } else {
      // Reset form for regular sale
      console.log("SALE FORM: Resetting form for regular sale");
      setNewSaleData({
        product_id: 0,
        quantity_sold: 1,
        selling_price: 0,
        clientId: 0,
        clientName: "",
      });
      setCurrentEstimateItem(0);
    }
  }, [pendingEstimateForSale, currentEstimateItem, products, clients]);

  const validateForm = () => {
    const errors: FormErrors = {
      product_id: !newSaleData.product_id,
      quantity_sold: newSaleData.quantity_sold <= 0,
      selling_price: newSaleData.selling_price <= 0,
      clientName: !newSaleData.clientName.trim()
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(error => error);
  };

  const handleProductChange = (productId: number, price: number) => {
    console.log("SALE FORM: Product changed", { productId, price });
    setNewSaleData({
      ...newSaleData,
      product_id: productId,
      selling_price: price,
    });
    setFormErrors({
      ...formErrors,
      product_id: !productId
    });
  };

  const handleClientChange = (clientId: number, clientName: string) => {
    console.log("SALE FORM: Client changed", { clientId, clientName });
    setNewSaleData({
      ...newSaleData,
      clientId: clientId,
      clientName: clientName,
    });
    
    setFormErrors({
      ...formErrors,
      clientName: !clientName.trim()
    });
  };

  const handleQuantityChange = (quantity: number) => {
    setNewSaleData({
      ...newSaleData,
      quantity_sold: quantity,
    });
    setFormErrors({
      ...formErrors,
      quantity_sold: quantity <= 0
    });
  };

  const handlePriceChange = (price: number) => {
    setNewSaleData({
      ...newSaleData,
      selling_price: price,
    });
    setFormErrors({
      ...formErrors,
      selling_price: price <= 0
    });
  };

  const getEstimateItemsInfo = () => {
    if (!pendingEstimateForSale?.items) return null;
    
    return {
      items: pendingEstimateForSale.items,
      currentIndex: currentEstimateItem,
      totalItems: pendingEstimateForSale.items.length,
      hasMoreItems: currentEstimateItem < pendingEstimateForSale.items.length - 1
    };
  };

  const moveToNextEstimateItem = () => {
    if (pendingEstimateForSale?.items && currentEstimateItem < pendingEstimateForSale.items.length - 1) {
      const nextIndex = currentEstimateItem + 1;
      setCurrentEstimateItem(nextIndex);
      console.log("SALE FORM: Moving to next estimate item:", nextIndex + 1);
    }
  };

  return {
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
  };
};
