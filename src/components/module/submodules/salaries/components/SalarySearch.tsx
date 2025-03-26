
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SalarySearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export const SalarySearch: React.FC<SalarySearchProps> = ({ search, setSearch }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher par nom, poste, département..."
        className="pl-8"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
