
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChallanBasicDetails } from "./form/ChallanBasicDetails";
import { ChallanItemsSection } from "./form/ChallanItemsSection";
import { ChallanAdditionalDetails } from "./form/ChallanAdditionalDetails";

interface CreateChallanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallanCreated?: (challanData: any) => void;
  editData?: any;
  isFullPage?: boolean;
}

interface ChallanForm {
  clientName: string;
  date: Date;
  deliveryAddress: string;
  items: ChallanItem[];
  notes: string;
  vehicleNo: string;
}

interface ChallanItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
}

export function CreateChallanDialog({
  open,
  onOpenChange,
  onChallanCreated,
  editData,
  isFullPage = false
}: CreateChallanDialogProps) {
  const [items, setItems] = useState<ChallanItem[]>([
    { id: 1, productId: 0, name: "", quantity: 1 },
  ]);
  
  const form = useForm<ChallanForm>({
    defaultValues: {
      clientName: "",
      date: new Date(),
      deliveryAddress: "",
      items: [],
      notes: "",
      vehicleNo: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editData && open) {
      form.setValue("clientName", editData.clientName || "");
      form.setValue("date", editData.date ? new Date(editData.date) : new Date());
      form.setValue("deliveryAddress", editData.deliveryAddress || "");
      form.setValue("notes", editData.notes || "");
      form.setValue("vehicleNo", editData.vehicleNo || "");
      
      if (editData.items && editData.items.length > 0) {
        setItems(editData.items.map((item: any, index: number) => ({
          id: index + 1,
          productId: item.productId || 0,
          name: item.name || "",
          quantity: item.quantity || 1,
        })));
      }
    } else if (!editData && open) {
      // Reset form when creating new challan
      form.reset();
      setItems([{ id: 1, productId: 0, name: "", quantity: 1 }]);
    }
  }, [editData, open, form]);
  
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, productId: 0, name: "", quantity: 1 }]);
  };
  
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: number, field: keyof ChallanItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const onSubmit = (data: ChallanForm) => {
    if (items.some(item => !item.name || item.quantity <= 0)) {
      toast.error("Please fill in all item details with valid quantities");
      return;
    }
    
    // Combine form data with items
    const challanData = {
      ...data,
      items: items,
      status: editData ? editData.status : "delivered",
      challanNo: editData ? editData.challanNo : `DC-${Date.now().toString().slice(-6)}`,
      createdAt: editData ? editData.createdAt : new Date().toISOString(),
    };
    
    console.log(editData ? "Updating delivery challan:" : "Creating delivery challan:", challanData);
    toast.success(editData ? "Delivery challan updated successfully" : "Delivery challan created successfully");
    
    // Call the callback function if provided
    if (onChallanCreated) {
      onChallanCreated(challanData);
    }
    
    onOpenChange(false);
    
    // Reset form and items
    form.reset();
    setItems([{ id: 1, productId: 0, name: "", quantity: 1 }]);
  };

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ChallanBasicDetails form={form} />
        
        <ChallanItemsSection 
          items={items}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
        />
        
        <ChallanAdditionalDetails form={form} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">
            {editData ? "Update Delivery Challan" : "Create Delivery Challan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  if (isFullPage) {
    return (
      <ScrollArea className="h-[70vh] pr-4">
        <FormContent />
      </ScrollArea>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Delivery Challan" : "Create New Delivery Challan"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <FormContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
