
import { toast } from "sonner";
import { Product, Sale } from "@/types";

interface SaleData {
  product_id: number;
  quantity_sold: number;
  selling_price: number;
  clientId?: number;
  clientName?: string;
  estimateId?: string;
}

export const validateSaleData = (
  saleData: SaleData, 
  products: Product[], 
  recordSale: Function
) => {
  console.log("SALE PROCESSOR: Validating sale data:", saleData);
  
  if (!saleData.product_id) {
    toast.error("Please select a product");
    return { isValid: false };
  }
  
  if (!saleData.quantity_sold || saleData.quantity_sold <= 0) {
    toast.error("Please enter a valid quantity");
    return { isValid: false };
  }
  
  if (!saleData.selling_price || saleData.selling_price <= 0) {
    toast.error("Please enter a valid price");
    return { isValid: false };
  }
  
  if (!saleData.clientName || !saleData.clientName.trim()) {
    toast.error("Please select or enter a client name");
    return { isValid: false };
  }
  
  // Find the product - handle both id and product_id fields
  const product = products.find(p => 
    p.product_id === saleData.product_id || 
    (p.id && parseInt(p.id.replace('product-', '')) === saleData.product_id)
  );
  
  if (!product) {
    console.error("SALE PROCESSOR: Product not found for ID:", saleData.product_id);
    toast.error("Selected product not found");
    return { isValid: false };
  }
  
  // Check stock availability
  const availableStock = parseInt(product.units as string);
  if (isNaN(availableStock) || availableStock < saleData.quantity_sold) {
    toast.error(`Insufficient stock. Available: ${availableStock || 0}`);
    return { isValid: false };
  }
  
  console.log("SALE PROCESSOR: Validation passed");
  return { isValid: true, product };
};

export const processSaleSubmission = async (
  saleData: SaleData, 
  recordSale: Function
): Promise<{ success: boolean; sale?: Sale }> => {
  try {
    console.log("SALE PROCESSOR: Processing sale submission:", saleData);
    
    const result = await recordSale(saleData);
    
    if (!result) {
      console.error("SALE PROCESSOR: recordSale returned null/undefined");
      toast.error("Failed to record sale - no result returned");
      return { success: false };
    }
    
    console.log("SALE PROCESSOR: Sale recorded successfully:", result);
    return { success: true, sale: result };
    
  } catch (error) {
    console.error("SALE PROCESSOR: Error processing sale:", error);
    toast.error(`Failed to process sale: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false };
  }
};
