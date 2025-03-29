
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';

interface CompaniesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onCreateCompany: () => void;
  onRefresh: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const CompaniesToolbar: React.FC<CompaniesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onCreateCompany,
  onRefresh,
  onToggleFilters,
  showFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher par nom, SIRET..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full"
            onClick={onSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          title="Rafraîchir la liste"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={onCreateCompany}>
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle entreprise
      </Button>
    </div>
  );
};

export default CompaniesToolbar;
