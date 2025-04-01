
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ElementsSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const ElementsSearch: React.FC<ElementsSearchProps> = ({ onSearch }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="p-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des éléments..."
          className="pl-8"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default ElementsSearch;
