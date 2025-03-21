
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClient: () => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  onAddClient
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Button onClick={onAddClient}>
        <UserPlus className="mr-2 h-4 w-4" />
        Nouveau Client
      </Button>
    </div>
  );
};

export default ClientSearch;
