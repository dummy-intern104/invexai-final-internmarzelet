
import { useState } from "react";
import { Client } from "@/types";
import { ClientListHeader } from "./ClientListHeader";
import { ClientTable } from "./ClientTable";
import { ClientPagination } from "./ClientPagination";
import { ClientEmptyState } from "./ClientEmptyState";

interface ClientListProps {
  clients: Client[];
  onDeleteClient: (id: number) => void;
  onAddClientClick: () => void;
}

export const ClientList = ({ clients, onDeleteClient, onAddClientClick }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (clients.length === 0) {
    return (
      <div className="bg-card rounded-lg border shadow-sm">
        <ClientEmptyState onAddClientClick={onAddClientClick} />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <ClientListHeader 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />
      
      <ClientTable 
        clients={currentClients}
        startIndex={startIndex}
        onDeleteClient={onDeleteClient}
      />

      <ClientPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalClients={filteredClients.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
