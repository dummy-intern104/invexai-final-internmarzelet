
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ClientsHeaderProps {
  onAddClientClick?: () => void;
}

export const ClientsHeader = ({ onAddClientClick }: ClientsHeaderProps) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddClientClick) {
      onAddClientClick();
    } else {
      navigate("/clients/add");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-1">
          Manage your client relationships
        </p>
      </div>
      <Button
        onClick={handleAddClick}
        className="self-start sm:self-auto"
      >
        <User className="mr-2 h-4 w-4" /> Add Client
      </Button>
    </div>
  );
};
