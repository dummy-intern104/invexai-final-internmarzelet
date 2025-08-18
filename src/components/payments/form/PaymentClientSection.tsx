
import { Label } from "@/components/ui/label";
import { Client } from "@/types";

interface PaymentClientSectionProps {
  clientName: string;
  clients: Client[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error: boolean;
  disabled?: boolean;
}

const PaymentClientSection = ({ 
  clientName, 
  clients, 
  onChange, 
  error, 
  disabled = false 
}: PaymentClientSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientName">Client <span className="text-red-500">*</span></Label>
      <select
        id="clientName"
        name="clientName"
        className={`flex h-10 w-full rounded-md border ${error ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        value={clientName}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.name}>
            {client.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">Client is required</p>
      )}
    </div>
  );
};

export default PaymentClientSection;
