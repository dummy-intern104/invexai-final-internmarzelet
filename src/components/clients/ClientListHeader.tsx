
import { RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientListHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientListHeader = ({ searchTerm, onSearchChange }: ClientListHeaderProps) => {
  return (
    <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <h2 className="text-xl font-semibold flex items-center">
        Client List
        <Button variant="ghost" size="sm" className="ml-2 text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </h2>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-grow sm:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10"
          />
        </div>
        <select 
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>
  );
};
