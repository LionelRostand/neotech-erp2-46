
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SortAsc,
  SortDesc,
  Filter,
  FileUp
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'name' | 'date' | 'size';
  sortDirection: 'asc' | 'desc';
  handleSort: (by: 'name' | 'date' | 'size') => void;
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
  onUploadClick: () => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  sortDirection,
  handleSort,
  view,
  setView,
  onUploadClick
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-between">
      <div className="relative w-full md:w-96">
        <Input
          placeholder="Rechercher des documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {sortDirection === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              Trier: {sortBy === 'name' ? 'Nom' : sortBy === 'size' ? 'Taille' : 'Date'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort('name')}>
              Nom
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('date')}>
              Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('size')}>
              Taille
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setView(prev => prev === 'grid' ? 'list' : 'grid')}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Changer de vue
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button onClick={onUploadClick}>
          <FileUp className="h-4 w-4 mr-2" />
          Téléverser
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
