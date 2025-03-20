
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarClock, Plus, RefreshCw, Search } from 'lucide-react';

interface ScheduledMessagesToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onCreateNewMessage: () => void;
}

const ScheduledMessagesToolbar: React.FC<ScheduledMessagesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  onRefresh,
  isLoading,
  onCreateNewMessage
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans les messages..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Select
        value={filterStatus}
        onValueChange={onFilterStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les messages</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="sent">Envoyé</SelectItem>
          <SelectItem value="failed">Échec</SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
        {isLoading ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        Actualiser
      </Button>
      
      <Button onClick={onCreateNewMessage}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau message
      </Button>
    </div>
  );
};

export default ScheduledMessagesToolbar;
