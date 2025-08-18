
import { InvoiceList } from "@/components/sales/InvoiceList";
import useAppStore from "@/store/appStore";

const SalesInvoices = () => {
  const { sales, products, clients } = useAppStore();

  // Convert sales data to invoice format for the component
  const invoices = sales.map(sale => ({
    id: sale.sale_id.toString(),
    invoiceNumber: `INV-${sale.sale_id}`,
    clientName: clients.find(c => c.id === sale.clientId)?.name || 'Unknown Client',
    date: sale.sale_date,
    amount: sale.selling_price * sale.quantity_sold,
    status: 'paid' as const,
    items: [{
      productName: products.find(p => p.product_id === sale.product_id)?.product_name || 'Unknown Product',
      quantity: sale.quantity_sold,
      price: sale.selling_price,
      total: sale.selling_price * sale.quantity_sold
    }]
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice List</h1>
          <p className="text-muted-foreground">Manage and view all your sales invoices</p>
        </div>
        <InvoiceList invoices={invoices} />
      </div>
    </div>
  );
};

export default SalesInvoices;
