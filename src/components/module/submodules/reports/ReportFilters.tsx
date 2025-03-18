
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ReportFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedPeriod,
  setSelectedPeriod,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
      <div>
        <h2 className="text-2xl font-bold">Rapports RH</h2>
        <p className="text-gray-500">Consultez et générez des rapports sur vos données RH</p>
      </div>
      <div className="flex gap-2">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Ce mois-ci</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
            <SelectItem value="custom">Personnalisé</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Exporter</Button>
        <Button>Nouveau rapport</Button>
      </div>
    </div>
  );
};
