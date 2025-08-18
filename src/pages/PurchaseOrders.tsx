
import { PurchaseOrderList } from "@/components/purchases/PurchaseOrderList";

const PurchaseOrders = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground">Create and manage purchase orders for your suppliers</p>
      </div>
      <PurchaseOrderList />
    </div>
  );
};

export default PurchaseOrders;
