
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Eye } from "lucide-react";
import { useState } from "react";

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
}

interface InvoiceListProps {
  invoices: Invoice[];
}

export const InvoiceList = ({ invoices }: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(invoice =>
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">No invoices match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{invoice.clientName}</p>
                  </div>
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium">
                      {new Date(invoice.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Items:</span>
                    <span className="text-sm">{invoice.items.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-lg font-semibold">₹{invoice.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
