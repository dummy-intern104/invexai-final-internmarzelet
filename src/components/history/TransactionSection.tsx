
import React from "react";
import { ChartLineIcon } from "lucide-react";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionList } from "./TransactionList";
import { Sale, Product } from "@/types";

interface TransactionSectionProps {
  sales: Sale[];
  onDeleteTransaction: (id: number) => void;
  productsExist: boolean;
  products?: Product[];
  searchTerm?: string;
  selectedDate?: string;
  transactionType?: string;
  filteredTransactions?: Sale[];
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TransactionSection = ({
  sales,
  products = [],
  searchTerm = "",
  selectedDate = "",
  transactionType = "all",
  filteredTransactions = sales,
  onSearchChange = () => {},
  onDateChange = () => {},
  onTypeChange = () => {},
  onDeleteTransaction,
  productsExist,
}: TransactionSectionProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 mb-4">
          <ChartLineIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>

        <TransactionFilters
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          transactionType={transactionType}
          onSearchChange={onSearchChange}
          onDateChange={onDateChange}
          onTypeChange={onTypeChange}
        />
      </div>

      <TransactionList
        filteredTransactions={filteredTransactions}
        onDeleteTransaction={onDeleteTransaction}
        productsExist={productsExist}
      />
    </div>
  );
};
