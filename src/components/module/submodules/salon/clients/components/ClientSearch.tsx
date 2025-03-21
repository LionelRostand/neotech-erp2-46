
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  UserPlus, 
  Filter, 
  SlidersHorizontal, 
  Heart, 
  Clock, 
  User, 
  CalendarDays,
  Download,
  Printer
} from "lucide-react";

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClient: () => void;
  filter?: string;
  onFilterChange?: (value: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  onAddClient,
  filter = 'all',
  onFilterChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-4 py-2"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
              onClick={() => onSearchChange('')}
            >
              <span className="sr-only">Effacer la recherche</span>
              <span aria-hidden="true">×</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onFilterChange && (
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                <SelectItem value="recent">Clients récents</SelectItem>
                <SelectItem value="loyal">Clients fidèles</SelectItem>
                <SelectItem value="inactive">Clients inactifs</SelectItem>
                <SelectItem value="birthday">Anniversaires du mois</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button onClick={onAddClient} className="bg-green-600 hover:bg-green-700 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Plus d'options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Imprimer la liste</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Exporter (Excel)</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Vues rapides</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onFilterChange && onFilterChange('recent')}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Visites récentes</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange && onFilterChange('loyal')}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Clients fidèles</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange && onFilterChange('birthday')}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Anniversaires</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange && onFilterChange('all')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Tous les clients</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filter && (
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            <span>Filtre actif:</span>
          </div>
          <span className="ml-1 font-medium">
            {filter === 'all' && 'Tous les clients'}
            {filter === 'recent' && 'Clients récents'}
            {filter === 'loyal' && 'Clients fidèles'}
            {filter === 'inactive' && 'Clients inactifs'}
            {filter === 'birthday' && 'Anniversaires du mois'}
          </span>
          {filter !== 'all' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 ml-2 text-xs"
              onClick={() => onFilterChange && onFilterChange('all')}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientSearch;
