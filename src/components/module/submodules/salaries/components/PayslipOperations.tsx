
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Filter, 
  Plus, 
  Settings 
} from 'lucide-react';
import PayslipFilters, { PayslipFiltersOptions } from './PayslipFilters';
import PayslipFilterDrawer from './PayslipFilterDrawer';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface PayslipOperationsProps {
  employees?: Employee[];
  companies?: Company[];
  onFilter: (filters: PayslipFiltersOptions) => void;
  currentFilters: PayslipFiltersOptions;
  onOpenGenerator: () => void;
  onOpenConfiguration: () => void;
  onExportData: () => void;
}

const PayslipOperations: React.FC<PayslipOperationsProps> = ({
  employees: providedEmployees,
  companies = [],
  onFilter,
  currentFilters,
  onOpenGenerator,
  onOpenConfiguration,
  onExportData
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { employees: hrEmployees } = useHrModuleData();
  
  // Always use hook, then decide which data to use
  const employeesToUse = providedEmployees && providedEmployees.length > 0 ? providedEmployees : hrEmployees;

  // Convert Employee[] to format required by PayslipFilters
  const formattedEmployees = employeesToUse.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`
  }));

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
        
        <PayslipFilters 
          employees={formattedEmployees}
          onApplyFilters={onFilter}
          currentFilters={currentFilters}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onExportData}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
        
        <Button variant="outline" onClick={onOpenConfiguration}>
          <Settings className="h-4 w-4 mr-2" />
          Configurer
        </Button>
        
        <Button onClick={onOpenGenerator}>
          <Plus className="h-4 w-4 mr-2" />
          Générer
        </Button>
      </div>

      <PayslipFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={onFilter}
        employees={employeesToUse}
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default PayslipOperations;
