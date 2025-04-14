import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Filter } from 'lucide-react';

export interface EvaluationsFilterProps {
  onFilterApplied: (filtered: any) => void;
}

const EvaluationsFilter: React.FC<EvaluationsFilterProps> = ({ onFilterApplied }) => {
  // Placeholder for filters functionality
  const handleApplyFilters = () => {
    // Apply filters logic
    onFilterApplied([]);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={handleApplyFilters}
      >
        <Filter className="h-4 w-4" />
        <span>Filtrer</span>
      </Button>
    </div>
  );
};

export default EvaluationsFilter;
