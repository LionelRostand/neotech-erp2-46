
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface SalaryHeaderProps {
  onExportExcel: () => void;
  onNewSalary: () => void;
}

export const SalaryHeader: React.FC<SalaryHeaderProps> = ({ onExportExcel, onNewSalary }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion des salaires</h2>
        <p className="text-muted-foreground">Gérez et suivez les salaires des employés</p>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <Button variant="outline" onClick={onExportExcel}>
          <Download className="h-4 w-4 mr-2" />
          Exporter Excel
        </Button>
        <Button onClick={onNewSalary}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>
    </div>
  );
};
