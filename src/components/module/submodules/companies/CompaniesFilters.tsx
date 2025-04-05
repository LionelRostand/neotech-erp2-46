
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyFilters } from './types';
import { CalendarIcon, FilterX } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CompaniesFiltersProps {
  filters: CompanyFilters;
  onFilterChange: (filters: CompanyFilters) => void;
  onResetFilters: () => void;
}

const CompaniesFilters: React.FC<CompaniesFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    onFilterChange({ ...filters, [name]: value });
  };

  // Handle date changes
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      onFilterChange({ ...filters, startDate: date.toString() });
    } else {
      const { startDate, ...rest } = filters;
      onFilterChange(rest);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry filter */}
          <div className="space-y-2">
            <Label htmlFor="industry">Secteur d'activité</Label>
            <Select 
              value={filters.industry || 'all'} 
              onValueChange={(value) => handleSelectChange('industry', value)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Tous les secteurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les secteurs</SelectItem>
                <SelectItem value="technology">Technologie</SelectItem>
                <SelectItem value="healthcare">Santé</SelectItem>
                <SelectItem value="education">Éducation</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Commerce</SelectItem>
                <SelectItem value="manufacturing">Industrie</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size filter */}
          <div className="space-y-2">
            <Label htmlFor="size">Taille</Label>
            <Select 
              value={filters.size || 'all'} 
              onValueChange={(value) => handleSelectChange('size', value)}
            >
              <SelectTrigger id="size">
                <SelectValue placeholder="Toutes les tailles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les tailles</SelectItem>
                <SelectItem value="1-10">1-10 employés</SelectItem>
                <SelectItem value="11-50">11-50 employés</SelectItem>
                <SelectItem value="51-200">51-200 employés</SelectItem>
                <SelectItem value="201-500">201-500 employés</SelectItem>
                <SelectItem value="501-1000">501-1000 employés</SelectItem>
                <SelectItem value="1000+">1000+ employés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CreatedAt date range filter - Start date */}
          <div className="space-y-2">
            <Label>Date de création</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? (
                    format(new Date(filters.startDate), "PPP")
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.startDate ? new Date(filters.startDate) : undefined}
                  onSelect={handleStartDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reset filters button */}
          <div className="space-y-2 flex items-end">
            <Button 
              variant="outline" 
              onClick={onResetFilters}
              className="w-full"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompaniesFilters;
