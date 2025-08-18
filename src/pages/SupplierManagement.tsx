
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Mail, Phone, MapPin, FileText, Pencil, Trash2 } from "lucide-react";
import { SupplierDialog } from "@/components/suppliers/SupplierDialog";
import { useSuppliers } from "@/components/suppliers/hooks/useSuppliers";
import { toast } from "sonner";

const SupplierManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { suppliers, loading, deleteSupplier } = useSuppliers();

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = async (supplierId: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(supplierId);
        toast.success("Supplier deleted successfully");
      } catch (error) {
        toast.error("Failed to delete supplier");
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading suppliers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Supplier Management</h1>
          <p className="text-gray-600">Manage your suppliers and their information</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new supplier.</p>
          <div className="mt-6">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      Active
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.email}</span>
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.phone}</span>
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{supplier.address}</span>
                    </div>
                  )}
                  
                  {supplier.gst && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">GST: {supplier.gst}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Added: {new Date(supplier.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SupplierDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        supplier={editingSupplier}
      />
    </div>
  );
};

export default SupplierManagement;
