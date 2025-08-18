
import React from "react";
import { MoveHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchAndActionsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenTransferDialog: () => void;
  onOpenProductDialog: () => void;
}

export const SearchAndActions: React.FC<SearchAndActionsProps> = ({
  searchQuery,
  onSearchChange,
  onOpenTransferDialog,
  onOpenProductDialog,
}) => {
  return (
    <div className="flex justify-between items-center">
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={onSearchChange}
        className="max-w-xs"
      />
      
      <div className="flex gap-2">
        <Button onClick={onOpenTransferDialog} className="flex items-center gap-2">
          <MoveHorizontal className="h-4 w-4" /> Transfer Products
        </Button>
        
        <Button onClick={onOpenProductDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>
    </div>
  );
};
