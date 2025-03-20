
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, Badge } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ScheduledMessagesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: string) => void;
  onCreateNewMessage: () => void;
}

const ScheduledMessagesToolbar: React.FC<ScheduledMessagesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  onCreateNewMessage
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-xl font-bold">Messages programmés</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrer par date</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterChange('all')}>
              <Calendar className="mr-2 h-4 w-4" />
              Tous
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('today')}>
              <Calendar className="mr-2 h-4 w-4" />
              Aujourd'hui
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('tomorrow')}>
              <Calendar className="mr-2 h-4 w-4" />
              Demain
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('this-week')}>
              <Calendar className="mr-2 h-4 w-4" />
              Cette semaine
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterChange('high-priority')}>
              <Badge variant="destructive" className="mr-2 px-1 py-0">!</Badge>
              Haute priorité
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="default"
          onClick={onCreateNewMessage}
        >
          Nouveau message
        </Button>
      </div>
    </div>
  );
};

export default ScheduledMessagesToolbar;
