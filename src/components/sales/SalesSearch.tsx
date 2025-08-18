
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SalesSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SalesSearch = ({ searchTerm, onSearchChange }: SalesSearchProps) => {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search sales..."
        value={searchTerm}
        onChange={onSearchChange}
        className="pl-10"
      />
    </div>
  );
};

export default SalesSearch;
