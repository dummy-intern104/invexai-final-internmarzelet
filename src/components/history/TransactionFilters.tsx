
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TransactionFiltersProps {
  searchTerm: string;
  selectedDate: string;
  transactionType: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TransactionFilters = ({
  searchTerm,
  selectedDate,
  transactionType,
  onSearchChange,
  onDateChange,
  onTypeChange,
}: TransactionFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Input
          type="date"
          value={selectedDate}
          onChange={onDateChange}
          className="dark:text-white"
        />
      </div>
      <div>
        <select
          value={transactionType}
          onChange={onTypeChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="sale">Sales</option>
        </select>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10 dark:text-white"
        />
      </div>
    </div>
  );
};
