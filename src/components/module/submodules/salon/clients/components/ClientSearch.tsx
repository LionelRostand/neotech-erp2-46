
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClient: () => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  onAddClient,
  filter,
  onFilterChange
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un client..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <div className="w-[180px]">
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              <SelectItem value="recent">Clients récents</SelectItem>
              <SelectItem value="loyal">Clients fidèles</SelectItem>
              <SelectItem value="inactive">Clients inactifs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onAddClient}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>
    </div>
  );
};

export default ClientSearch;
