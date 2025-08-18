import React, { useState, useEffect } from 'react';
import { EstimatesHeader } from '@/components/estimates/EstimatesHeader';
import { EstimatesEmptyState } from '@/components/estimates/EstimatesEmptyState';
import { EstimatesTable } from '@/components/estimates/EstimatesTable';
import { EstimatesAboutSection } from '@/components/estimates/EstimatesAboutSection';
import { CreateEstimateDialog } from '@/components/estimates/CreateEstimateDialog';
import { EstimatePrint } from '@/components/estimates/EstimatePrint';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Estimate {
  id: string;
  clientName: string;
  date: string;
  referenceNo: string;
  totalAmount: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  validUntil: string;
  createdAt: string;
  items?: any[];
  notes?: string;
  terms?: string;
}

const Estimates = () => {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const navigate = useNavigate();

  // Fetch estimates from Supabase
  const { data: estimates = [], isLoading, refetch } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estimates')
        .select(`
          *,
          estimate_items (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching estimates:', error);
        return [];
      }
      
      return data?.map(est => ({
        id: est.id,
        clientName: est.client_name,
        date: est.date,
        referenceNo: est.estimate_number,
        totalAmount: Number(est.total_amount),
        status: est.status as "pending" | "accepted" | "rejected" | "completed",
        validUntil: est.valid_until || '',
        createdAt: est.created_at,
        items: est.estimate_items || [],
        notes: est.notes,
        terms: est.terms,
      })) || [];
    }
  });

  const updateEstimateStatus = async (estimateId: string, newStatus: "pending" | "accepted" | "rejected" | "completed") => {
    try {
      const { error } = await supabase
        .from('estimates')
        .update({ status: newStatus })
        .eq('id', estimateId);

      if (error) throw error;
      
      toast.success('Estimate status updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating estimate status:', error);
      toast.error('Failed to update estimate status');
    }
  };

  const handleUpdateEstimate = async (estimateData: any) => {
    if (!editingEstimate) return;
    
    try {
      const { error } = await supabase
        .from('estimates')
        .update({
          client_name: estimateData.clientName,
          date: estimateData.date,
          total_amount: estimateData.totalAmount || 0,
          status: estimateData.status || "pending",
          valid_until: estimateData.validUntil,
          notes: estimateData.notes,
          terms: estimateData.terms,
        })
        .eq('id', editingEstimate.id);

      if (error) throw error;

      toast.success('Estimate updated successfully');
      setEditingEstimate(null);
      refetch();
    } catch (error) {
      console.error('Error updating estimate:', error);
      toast.error('Failed to update estimate');
    }
  };

  const deleteEstimate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Estimate deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting estimate:', error);
      toast.error('Failed to delete estimate');
    }
  };

  const handleCreateEstimate = () => {
    navigate('/estimates/create');
  };

  const handlePrintEstimate = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setIsPrintDialogOpen(true);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setIsEditDialogOpen(true);
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
      <EstimatesHeader onCreateEstimate={handleCreateEstimate} />

      {estimates.length === 0 ? (
        <EstimatesEmptyState onCreateEstimate={handleCreateEstimate} />
      ) : (
        <EstimatesTable 
          estimates={estimates}
          onPrintEstimate={handlePrintEstimate}
          onDeleteEstimate={deleteEstimate}
          onEditEstimate={handleEditEstimate}
          onUpdateEstimateStatus={updateEstimateStatus}
        />
      )}

      <EstimatesAboutSection />
      
      {editingEstimate && (
        <CreateEstimateDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onEstimateCreated={handleUpdateEstimate}
          editingEstimate={editingEstimate}
        />
      )}
      
      {selectedEstimate && (
        <EstimatePrint
          open={isPrintDialogOpen}
          onOpenChange={setIsPrintDialogOpen}
          estimate={selectedEstimate}
        />
      )}
    </div>
  );
};

export default Estimates;
