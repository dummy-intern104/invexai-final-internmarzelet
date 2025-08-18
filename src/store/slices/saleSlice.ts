
import { create } from 'zustand';
import { Sale, Product } from '@/types';
import { toast } from 'sonner';
import { SaleState } from '../types';

export const createSaleSlice = (
  set: any, 
  get: any, 
  getProducts: () => Product[], 
  updateProduct: (updatedProduct: Product) => void,
  updateClientPurchase: (clientName: string, amount: number, productName: string, quantity: number, transactionId?: string) => void
) => ({
  sales: [],
  
  setSales: (sales: Sale[]) => set({ sales }),
  
  // Renamed function for backward compatibility
  addSale: (saleData) => {
    return get().recordSale(saleData);
  },
  
  recordSale: (saleData) => {
    try {
      console.log("SALE SLICE: Starting recordSale with data:", saleData);
      
      // Validate input data
      if (!saleData) {
        console.error("SALE SLICE: No sale data provided");
        toast.error("No sale data provided");
        return null;
      }
      
      if (!saleData.product_id || !saleData.quantity_sold || !saleData.selling_price) {
        console.error("SALE SLICE: Missing required sale data", saleData);
        toast.error("Missing required sale information");
        return null;
      }
      
      const products = getProducts();
      console.log("SALE SLICE: Available products:", products.length);
      
      if (!products || products.length === 0) {
        console.error("SALE SLICE: No products available");
        toast.error("No products available");
        return null;
      }
      
      // Find the product
      const product = products.find(p => p.product_id === saleData.product_id);
      
      if (!product) {
        console.error("SALE SLICE: Product not found for ID:", saleData.product_id);
        toast.error("Product not found");
        return null;
      }
      
      console.log("SALE SLICE: Found product:", product);
      
      // Check stock availability
      const currentUnits = parseInt(product.units as string);
      if (isNaN(currentUnits) || currentUnits < saleData.quantity_sold) {
        console.error("SALE SLICE: Insufficient stock", { 
          available: currentUnits, 
          requested: saleData.quantity_sold 
        });
        toast.error(`Insufficient stock. Available: ${currentUnits}`);
        return null;
      }
      
      // Generate unique transaction ID for this sale
      const transactionId = `sale-${Date.now()}-${saleData.product_id}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("SALE SLICE: Generated transaction ID:", transactionId);
      
      // Get current state to create new sale ID
      const currentState = get();
      if (!currentState || !Array.isArray(currentState.sales)) {
        console.error("SALE SLICE: Invalid current state", currentState);
        toast.error("Invalid application state");
        return null;
      }
      
      const currentSales = currentState.sales;
      const newSaleId = currentSales.length > 0 ? Math.max(...currentSales.map(s => s.sale_id)) + 1 : 1;
      
      const newSale: Sale = {
        sale_id: newSaleId,
        product_id: saleData.product_id,
        quantity_sold: saleData.quantity_sold,
        selling_price: saleData.selling_price,
        sale_date: new Date().toISOString(),
        product,
        clientId: saleData.clientId,
        clientName: saleData.clientName,
        transactionId
      };
      
      console.log("SALE SLICE: Created sale record:", {
        saleId: newSale.sale_id,
        transactionId,
        clientName: saleData.clientName,
        product: product.product_name,
        quantity: saleData.quantity_sold,
        price: saleData.selling_price
      });
      
      // Update the state
      const updateResult = set((state: SaleState) => {
        console.log("SALE SLICE: Updating state with new sale");
        const clientInfo = saleData.clientName ? ` to ${saleData.clientName}` : '';
        toast.success(`Sale recorded: ${saleData.quantity_sold} ${product.product_name}(s)${clientInfo}`);
        
        return { 
          sales: [newSale, ...state.sales]
        };
      });
      
      console.log("SALE SLICE: State update result:", updateResult);
      
      // Update product stock
      const newUnits = Math.max(0, currentUnits - saleData.quantity_sold);
      const updatedProduct = { 
        ...product, 
        units: newUnits.toString() 
      };
      
      console.log("SALE SLICE: Updating product stock:", {
        productId: product.product_id,
        oldUnits: currentUnits,
        newUnits,
        quantitySold: saleData.quantity_sold
      });
      
      // Check if updateProduct function exists
      if (typeof updateProduct !== 'function') {
        console.error("SALE SLICE: updateProduct is not a function");
        toast.error("Cannot update product stock");
        return null;
      }
      
      updateProduct(updatedProduct);
      
      // Update client purchase if client name exists
      if (saleData.clientName && saleData.clientName.trim()) {
        console.log("SALE SLICE: Updating client purchase:", { 
          clientName: saleData.clientName, 
          amount: saleData.selling_price, 
          productName: product.product_name, 
          quantity: saleData.quantity_sold,
          transactionId
        });
        
        // Check if updateClientPurchase function exists
        if (typeof updateClientPurchase !== 'function') {
          console.error("SALE SLICE: updateClientPurchase is not a function");
        } else {
          updateClientPurchase(
            saleData.clientName.trim(), 
            saleData.selling_price, 
            product.product_name, 
            saleData.quantity_sold,
            transactionId
          );
        }
      } else {
        console.log("SALE SLICE: No client specified, skipping client update");
      }
      
      console.log("SALE SLICE: Sale recording completed successfully:", newSale);
      return newSale;
      
    } catch (error) {
      console.error("SALE SLICE: Error in recordSale:", error);
      console.error("SALE SLICE: Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      toast.error(`Failed to record sale: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  },
  
  deleteSale: (saleId) => {
    const state = get();
    // Find the sale to be deleted
    const saleToDelete = state.sales.find((sale: Sale) => sale.sale_id === saleId);
    
    if (!saleToDelete) {
      toast.error("Sale not found");
      return;
    }
    
    console.log("SALE DELETE: Deleting sale:", {
      saleId,
      transactionId: saleToDelete.transactionId,
      clientName: saleToDelete.clientName
    });
    
    // Update product stock in the product store
    const products = getProducts();
    const product = products.find(p => p.product_id === saleToDelete.product_id);
    
    if (product) {
      const currentUnits = parseInt(product.units as string);
      const newUnits = currentUnits + saleToDelete.quantity_sold;
      const updatedProduct = { 
        ...product, 
        units: newUnits.toString() 
      };
      
      console.log("SALE DELETE: Restoring product stock:", {
        productId: product.product_id,
        oldUnits: currentUnits,
        newUnits,
        quantityRestored: saleToDelete.quantity_sold
      });
      
      updateProduct(updatedProduct);
    }
    
    // Remove the sale
    set((state: SaleState) => {
      toast.success("Sale deleted successfully");
      return { 
        sales: state.sales.filter(sale => sale.sale_id !== saleId)
      };
    });
    
    console.log("SALE DELETE: Sale deletion complete");
  }
});

// This is just a placeholder since the standalone store needs the product store
const useStandaloneSaleStore = create<SaleState>((set, get) => 
  createSaleSlice(set, get, () => [], () => {}, () => {})
);

export default useStandaloneSaleStore;
