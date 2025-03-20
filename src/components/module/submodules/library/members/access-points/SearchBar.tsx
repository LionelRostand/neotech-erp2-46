
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full md:w-96">
      <Input
        placeholder="Rechercher un point d'accès..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <MapPin size={16} />
      </div>
    </div>
  );
};

export default SearchBar;
