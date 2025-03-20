
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
import { Search, Calendar, Plus } from 'lucide-react';

export interface ScheduledMessagesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onCreateNewMessage: () => void;
}

const ScheduledMessagesToolbar: React.FC<ScheduledMessagesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  onCreateNewMessage
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un message..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select 
          defaultValue="all"
          onValueChange={onFilterChange}
        >
          <SelectTrigger className="w-full sm:w-40">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="tomorrow">Demain</SelectItem>
            <SelectItem value="this-week">Cette semaine</SelectItem>
            <SelectItem value="high-priority">Priorité haute</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={onCreateNewMessage}
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nouveau message
      </Button>
    </div>
  );
};

export default ScheduledMessagesToolbar;
