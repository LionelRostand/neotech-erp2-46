
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Filter } from "lucide-react";

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClient: () => void;
  filter?: string;
  onFilterChange?: (value: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  onAddClient,
  filter = 'all',
  onFilterChange
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row items-center justify-between mb-6">
      <div className="relative w-full sm:w-auto flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, email ou téléphone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-4 py-2"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {onFilterChange && (
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              <SelectItem value="recent">Clients récents</SelectItem>
              <SelectItem value="loyal">Clients fidèles</SelectItem>
              <SelectItem value="inactive">Clients inactifs</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Button onClick={onAddClient}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>
    </div>
  );
};

export default ClientSearch;
