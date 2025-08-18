
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientTableRow } from "./ClientTableRow";
import { Client } from "@/types";

interface ClientTableProps {
  clients: Client[];
  startIndex: number;
  onDeleteClient: (id: number) => void;
}

export const ClientTable = ({ clients, startIndex, onDeleteClient }: ClientTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Ref No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Recent Products</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client, index) => (
              <ClientTableRow
                key={client.id}
                client={client}
                index={index}
                startIndex={startIndex}
                onDeleteClient={onDeleteClient}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-4">
                No clients found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
