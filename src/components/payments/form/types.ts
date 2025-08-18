
export interface PaymentFormData {
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  method: string;
  description: string;
  relatedSaleId: number | undefined;
  gstNumber: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentFormErrors {
  clientName: boolean;
  amount: boolean;
  method: boolean;
  description: boolean;
  gstNumber: boolean;
}
