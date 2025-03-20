
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sectorFilter: string;
  onSectorFilterChange: (value: string) => void;
  sectors: string[];
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  sectorFilter,
  onSectorFilterChange,
  sectors
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select
        value={sectorFilter}
        onValueChange={onSectorFilterChange}
      >
        <SelectTrigger className="w-[200px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Secteur d'activité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les secteurs</SelectItem>
          {sectors.map(sector => (
            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSearch;
