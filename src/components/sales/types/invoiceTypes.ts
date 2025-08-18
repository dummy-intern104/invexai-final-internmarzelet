
export interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  total: number;
}

export interface InvoiceForm {
  clientName: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  discount: number;
  gstRate: number;
  paymentMode: string;
}
