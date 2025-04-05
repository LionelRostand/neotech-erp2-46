
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Thermometer } from "lucide-react";

interface ProspectSearchProps {
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
}

const ProspectSearch: React.FC<ProspectSearchProps> = ({
  searchTerm,
  statusFilter,
  setSearchTerm,
  setStatusFilter,
  statusOptions = []
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher un prospect..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      
      <Select
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="w-[180px] h-9">
          <Thermometer className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProspectSearch;
