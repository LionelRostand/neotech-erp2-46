
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, GitBranch } from "lucide-react";
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunitySearchProps {
  searchTerm: string;
  stageFilter: string;
  setSearchTerm: (value: string) => void;
  setStageFilter: (value: string) => void;
}

const OpportunitySearch: React.FC<OpportunitySearchProps> = ({
  searchTerm,
  stageFilter,
  setStageFilter,
  setSearchTerm
}) => {
  const { getStageLabel } = useOpportunityUtils();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher une opportunité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select
        value={stageFilter}
        onValueChange={setStageFilter}
      >
        <SelectTrigger className="w-[180px]">
          <GitBranch className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Étape" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les étapes</SelectItem>
          <SelectItem value="new">Nouveau</SelectItem>
          <SelectItem value="negotiation">En négociation</SelectItem>
          <SelectItem value="quote_sent">Devis envoyé</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="won">Gagné</SelectItem>
          <SelectItem value="lost">Perdu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OpportunitySearch;
