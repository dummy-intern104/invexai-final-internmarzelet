
import React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpiryHeaderProps {
  onAddExpiry: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const ExpiryHeader = ({
  onAddExpiry,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ExpiryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Expiry</h1>
        <p className="text-muted-foreground">
          Track and manage product expiration dates
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products or batch numbers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-[250px]"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="disposed">Disposed</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onAddExpiry} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Expiry Record
        </Button>
      </div>
    </div>
  );
};
