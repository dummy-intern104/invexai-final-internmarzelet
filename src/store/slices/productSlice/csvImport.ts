
import { toast } from 'sonner';
import { Product } from '@/types';

export const createCSVImportOperations = (set: any, get: any) => ({
  importProductsFromCSV: async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const products: Product[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.trim());
        
        // Map CSV columns to product properties
        const productData: any = {};
        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          switch (header) {
            case 'product_name':
            case 'name':
              productData.product_name = value;
              break;
            case 'category':
              productData.category = value || 'Uncategorized';
              break;
            case 'price':
              productData.price = parseFloat(value) || 0;
              break;
            case 'units':
            case 'stock':
            case 'quantity':
              productData.units = value || '0';
              break;
            case 'reorder_level':
            case 'reorder':
              productData.reorder_level = parseInt(value) || 5;
              break;
          }
        });
        
        if (productData.product_name) {
          const existingProducts = get().products;
          const newProductId = existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.product_id || 0)) + 1 : 1;
          
          const newProduct: Product = {
            id: `product-${newProductId}`, // Generate string ID
            product_id: newProductId,
            product_name: productData.product_name,
            category: productData.category || 'Uncategorized',
            price: productData.price || 0,
            units: productData.units || '0',
            reorder_level: productData.reorder_level || 5,
            created_at: new Date().toISOString(),
            user_id: 'mock-user', // Add required user_id
          };
          
          products.push(newProduct);
        }
      }
      
      if (products.length > 0) {
        set((state: any) => ({
          products: [...state.products, ...products]
        }));
        
        toast.success(`Successfully imported ${products.length} products from CSV`);
      } else {
        toast.error("No valid products found in CSV file");
      }
    } catch (error) {
      console.error('CSV import error:', error);
      toast.error("Failed to import CSV file");
    }
  }
});
