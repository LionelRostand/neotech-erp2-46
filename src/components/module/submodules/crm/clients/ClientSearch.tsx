
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sectorFilter: string;
  onSectorFilterChange: (value: string) => void;
  sectorOptions?: { value: string; label: string; }[];
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  sectorFilter,
  onSectorFilterChange,
  sectorOptions = [
    { value: 'all', label: 'Tous les secteurs' },
    { value: 'technology', label: 'Technologie' },
    { value: 'healthcare', label: 'Santé' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Éducation' },
    { value: 'retail', label: 'Commerce de détail' }
  ]
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9"
        />
      </div>
      
      <div className="w-full md:w-64">
        <Label htmlFor="sector-filter" className="sr-only">Filtrer par secteur</Label>
        <Select value={sectorFilter} onValueChange={onSectorFilterChange}>
          <SelectTrigger id="sector-filter" className="h-9">
            <SelectValue placeholder="Filtrer par secteur" />
          </SelectTrigger>
          <SelectContent>
            {sectorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientSearch;
