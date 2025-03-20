
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Search,
  FileUp,
  Calendar,
  Text,
  LayoutGrid,
  LayoutList
} from 'lucide-react';

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
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <SortAsc className="h-4 w-4 mr-1" />
              Trier
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className={sortBy === 'name' ? 'font-semibold' : ''}
              onClick={() => handleSort('name')}
            >
              <Text className="h-4 w-4 mr-2" />
              Nom
              {sortBy === 'name' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortBy === 'date' ? 'font-semibold' : ''}
              onClick={() => handleSort('date')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Date
              {sortBy === 'date' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortBy === 'size' ? 'font-semibold' : ''}
              onClick={() => handleSort('size')}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Taille
              {sortBy === 'size' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex border rounded-md overflow-hidden">
          <Button 
            variant={view === 'grid' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-9 rounded-none"
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-9 rounded-none"
            onClick={() => setView('list')}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={onUploadClick} className="h-9">
          <FileUp className="h-4 w-4 mr-2" />
          Téléverser
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
