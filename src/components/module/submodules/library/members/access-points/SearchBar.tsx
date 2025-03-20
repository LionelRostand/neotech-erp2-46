
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddAccessPoint: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onAddAccessPoint
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="relative md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un point d'accès..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button onClick={onAddAccessPoint}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un point d'accès
      </Button>
    </div>
  );
};

export default SearchBar;
