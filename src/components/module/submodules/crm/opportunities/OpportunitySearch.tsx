
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunitySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  stageFilter: string;
  onStageFilterChange: (value: string) => void;
  onFilterButtonClick?: () => void;
}

const OpportunitySearch: React.FC<OpportunitySearchProps> = ({
  searchTerm,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  onFilterButtonClick
}) => {
  const opportunityUtils = useOpportunityUtils();
  const stages = opportunityUtils.getAllStages();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher une opportunité..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select
        value={stageFilter}
        onValueChange={onStageFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Étape" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les étapes</SelectItem>
          {stages.map(stage => (
            <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {onFilterButtonClick && (
        <Button variant="outline" onClick={onFilterButtonClick}>
          <Filter className="mr-2 h-4 w-4" />
          Plus de filtres
        </Button>
      )}
    </div>
  );
};

export default OpportunitySearch;
