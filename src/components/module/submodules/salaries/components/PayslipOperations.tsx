
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Filter, 
  Plus, 
  Settings 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from '@/components/ui/dialog';
import PayslipFilterDialog from './PayslipFilterDialog';
import PaySlipGenerator from '../PaySlipGenerator';
import PayslipConfiguration from '../components/PayslipConfiguration';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import PayslipFilters, { PayslipFiltersOptions } from './PayslipFilters';

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
  employees = [],
  companies = [],
  onFilter,
  currentFilters,
  onOpenGenerator,
  onOpenConfiguration,
  onExportData
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <PayslipFilters 
        employees={employees}
        onApplyFilters={onFilter}
        currentFilters={currentFilters}
      />
      
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
    </div>
  );
};

export default PayslipOperations;
