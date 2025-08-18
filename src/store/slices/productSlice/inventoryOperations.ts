
import { toast } from 'sonner';
import { Product } from '@/types';

export const createInventoryOperations = (set: any, get: any) => ({
  transferProduct: (productId: number, quantity: number, destinationType: string) => {
    const state = get();
    const sourceProduct = state.products.find((p: Product) => p.product_id === productId);
    
    if (!sourceProduct) {
      toast.error("Product not found");
      return;
    }
    
    const currentUnits = parseInt(sourceProduct.units as string);
    if (currentUnits < quantity) {
      toast.error("Insufficient stock to transfer");
      return;
    }
    
    // Update source product stock
    const updatedSourceProduct = {
      ...sourceProduct,
      units: (currentUnits - quantity).toString()
    };
    
    // Create or update destination product
    const isWarehouse = sourceProduct.product_name.includes("(Warehouse)");
    const destinationName = destinationType === 'warehouse' 
      ? `${sourceProduct.product_name.replace(" (Warehouse)", "")} (Warehouse)`
      : sourceProduct.product_name.replace(" (Warehouse)", "");
    
    const existingDestination = state.products.find((p: Product) => 
      p.product_name === destinationName
    );
    
    if (existingDestination) {
      // Update existing destination product
      const destinationUnits = parseInt(existingDestination.units as string) + quantity;
      const updatedDestination = {
        ...existingDestination,
        units: destinationUnits.toString()
      };
      
      set((state: any) => ({
        products: state.products.map((p: Product) => {
          if (p.product_id === productId) return updatedSourceProduct;
          if (p.product_id === existingDestination.product_id) return updatedDestination;
          return p;
        })
      }));
    } else {
      // Create new destination product
      const newProductId = state.products.length > 0 ? Math.max(...state.products.map((p: Product) => p.product_id || 0)) + 1 : 1;
      const newDestinationProduct: Product = {
        id: `product-${newProductId}`,
        product_id: newProductId,
        product_name: destinationName,
        category: sourceProduct.category,
        price: sourceProduct.price,
        units: quantity.toString(),
        reorder_level: sourceProduct.reorder_level,
        created_at: new Date().toISOString(),
        user_id: sourceProduct.user_id || 'mock-user',
      };
      
      set((state: any) => ({
        products: state.products.map((p: Product) => 
          p.product_id === productId ? updatedSourceProduct : p
        ).concat([newDestinationProduct])
      }));
    }
    
    const sourceLocation = isWarehouse ? 'Warehouse' : 'Local Shop';
    const destLocation = destinationType === 'warehouse' ? 'Warehouse' : 'Local Shop';
    toast.success(`Transferred ${quantity} units from ${sourceLocation} to ${destLocation}`);
  },
  
  restockProduct: (productId: number, quantity: number) => {
    set((state: any) => {
      const updatedProducts = state.products.map((product: Product) => 
        product.product_id === productId
          ? { 
              ...product, 
              units: (parseInt(product.units as string) + quantity).toString()
            }
          : product
      );
      
      toast.success(`Restocked ${quantity} units`);
      return { products: updatedProducts };
    });
  }
});
