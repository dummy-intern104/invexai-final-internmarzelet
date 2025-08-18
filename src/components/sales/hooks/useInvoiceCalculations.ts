
import { InvoiceItem } from '../types/invoiceTypes';

export const useInvoiceCalculations = (items: InvoiceItem[], discount: number = 0) => {
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateGST = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + (itemTotal * item.gstRate / 100);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    return subtotal + gst - discount;
  };

  return {
    subtotal: calculateSubtotal(),
    gstAmount: calculateGST(),
    totalAmount: calculateTotal()
  };
};
