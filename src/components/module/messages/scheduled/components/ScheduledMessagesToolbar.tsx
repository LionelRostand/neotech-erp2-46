
import React from 'react';
import { Search, PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduledMessagesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: 'all' | 'upcoming';
  onFilterChange: (value: string) => void;
  onCreateMessage: () => void;
}

const ScheduledMessagesToolbar: React.FC<ScheduledMessagesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  onCreateMessage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
      <div className="flex flex-1 items-center space-x-2 w-full sm:w-auto">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un message..."
            className="pl-8 flex-1"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select
          value={filter}
          onValueChange={onFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="upcoming">Prochain envoi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onCreateMessage} className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouveau message
      </Button>
    </div>
  );
};

export default ScheduledMessagesToolbar;
