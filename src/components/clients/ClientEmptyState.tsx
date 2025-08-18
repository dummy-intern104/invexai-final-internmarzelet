
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientEmptyStateProps {
  onAddClientClick: () => void;
}

export const ClientEmptyState = ({ onAddClientClick }: ClientEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center smooth-scroll">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No Clients Yet</h3>
      <p className="text-muted-foreground mt-1 mb-6">Add your first client to get started</p>
      <Button onClick={onAddClientClick}>
        <Plus className="mr-2 h-4 w-4" /> Add Your First Client
      </Button>
    </div>
  );
};
