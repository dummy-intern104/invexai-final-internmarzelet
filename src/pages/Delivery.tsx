
import React, { useState, useEffect } from 'react';
import useAppStore from '@/store/appStore';
import { CreateChallanDialog } from '@/components/delivery/CreateChallanDialog';
import { DeliveryChallanPrint } from '@/components/delivery/DeliveryChallanPrint';
import { DeliveryHeader } from '@/components/delivery/DeliveryHeader';
import { DeliveryEmptyState } from '@/components/delivery/DeliveryEmptyState';
import { DeliveryTable } from '@/components/delivery/DeliveryTable';
import { DeliveryAboutSection } from '@/components/delivery/DeliveryAboutSection';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryChallan {
  id: string;
  clientName: string;
  date: string;
  challanNo: string;
  status: "pending" | "delivered" | "cancelled";
  vehicleNo?: string;
  deliveryAddress?: string;
  createdAt: string;
  items?: any[];
  itemsCount?: number;
  notes?: string;
}

const Delivery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<DeliveryChallan | null>(null);
  const [editingChallan, setEditingChallan] = useState<DeliveryChallan | null>(null);

  // Fetch delivery challans from Supabase
  const { data: rawChallans = [], isLoading, refetch } = useQuery({
    queryKey: ['delivery-challans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_challans')
        .select(`
          *,
          delivery_challan_items (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching delivery challans:', error);
        return [];
      }
      
      return data || [];
    }
  });

  // Convert raw data to component format
  const challans: DeliveryChallan[] = rawChallans.map(challan => ({
    id: challan.id,
    clientName: challan.client_name,
    date: challan.date,
    challanNo: challan.challan_number,
    status: challan.status as "pending" | "delivered" | "cancelled",
    vehicleNo: challan.vehicle_number || '',
    deliveryAddress: challan.delivery_address || '',
    createdAt: challan.created_at,
    items: challan.delivery_challan_items || [],
    itemsCount: challan.delivery_challan_items?.length || 0,
    notes: challan.notes,
  }));

  const handleCreateChallan = async (challanData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to create delivery challans');
        return;
      }

      const { data, error } = await supabase
        .from('delivery_challans')
        .insert({
          user_id: user.id,
          challan_number: challanData.challanNo || `DC-${Date.now().toString().slice(-6)}`,
          client_name: challanData.clientName,
          date: challanData.date,
          vehicle_number: challanData.vehicleNo,
          delivery_address: challanData.deliveryAddress,
          notes: challanData.notes,
          status: challanData.status || "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Insert items if provided
      if (challanData.items && challanData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('delivery_challan_items')
          .insert(
            challanData.items.map((item: any) => ({
              challan_id: data.id,
              product_name: item.product_name,
              quantity: item.quantity,
            }))
          );

        if (itemsError) throw itemsError;
      }

      toast.success("Delivery challan created successfully");
      refetch();
    } catch (error) {
      console.error('Error creating challan:', error);
      toast.error('Failed to create delivery challan');
    }
  };

  const handleUpdateChallan = async (challanData: any) => {
    if (!editingChallan) return;
    
    try {
      const { error } = await supabase
        .from('delivery_challans')
        .update({
          client_name: challanData.clientName,
          date: challanData.date,
          vehicle_number: challanData.vehicleNo,
          delivery_address: challanData.deliveryAddress,
          notes: challanData.notes,
          status: challanData.status || editingChallan.status,
        })
        .eq('id', editingChallan.id);

      if (error) throw error;

      toast.success("Delivery challan updated successfully");
      setEditingChallan(null);
      refetch();
    } catch (error) {
      console.error('Error updating challan:', error);
      toast.error('Failed to update delivery challan');
    }
  };

  const handleStatusChange = async (id: string, newStatus: "delivered") => {
    try {
      const { error } = await supabase
        .from('delivery_challans')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Delivery status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update delivery status');
    }
  };

  const handleChallanAction = (challanData: any) => {
    if (editingChallan) {
      handleUpdateChallan(challanData);
    } else {
      handleCreateChallan(challanData);
    }
  };

  const handleEditChallan = (challan: DeliveryChallan) => {
    console.log("Editing challan:", challan);
    setEditingChallan(challan);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingChallan(null);
  };

  const deleteChallan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('delivery_challans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Delivery challan deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting challan:', error);
      toast.error('Failed to delete delivery challan');
    }
  };

  const handlePrintChallan = (challan: DeliveryChallan) => {
    console.log("Printing challan:", challan);
    setSelectedChallan(challan);
    setIsPrintDialogOpen(true);
  };

  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <DeliveryHeader onCreateChallan={openCreateDialog} />

      {challans.length === 0 ? (
        <DeliveryEmptyState onCreateChallan={openCreateDialog} />
      ) : (
        <DeliveryTable 
          challans={challans}
          onEditChallan={handleEditChallan}
          onDeleteChallan={deleteChallan}
          onPrintChallan={handlePrintChallan}
          onStatusChange={handleStatusChange}
        />
      )}

      <DeliveryAboutSection />
      
      <CreateChallanDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogClose}
        onChallanCreated={handleChallanAction}
        editData={editingChallan}
      />
      
      {selectedChallan && (
        <DeliveryChallanPrint
          open={isPrintDialogOpen}
          onOpenChange={setIsPrintDialogOpen}
          challan={selectedChallan}
        />
      )}
    </div>
  );
};

export default Delivery;
