
import React, { useState, useEffect } from 'react';
import { usePayslipsData } from '@/hooks/usePayslipsData';
import { PaySlip } from '@/types/payslip';
import { Card, CardContent } from '@/components/ui/card';
import PayslipOperations from './PayslipOperations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Download, File, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface PayslipFiltersState {
  employeeId: string;
  year: number | null;
  month: string;
  startDate: string;
  endDate: string;
}

const PayslipList: React.FC = () => {
  const { payslips, isLoading, error } = usePayslipsData();
  const navigate = useNavigate();
  const [filteredPayslips, setFilteredPayslips] = useState<PaySlip[]>([]);
  const [filters, setFilters] = useState<PayslipFiltersState>({
    employeeId: '',
    year: null,
    month: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    console.log('Payslips from hook:', payslips);
    
    // Filter payslips based on filters
    let filtered = [...payslips];
    
    if (filters.employeeId) {
      filtered = filtered.filter(slip => slip.employeeId === filters.employeeId);
    }
    
    if (filters.year) {
      filtered = filtered.filter(slip => slip.year === filters.year);
    }
    
    if (filters.month) {
      filtered = filtered.filter(slip => slip.month === filters.month);
    }
    
    setFilteredPayslips(filtered);
  }, [payslips, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleOpenGenerator = () => {
    // Navigate to create tab
    navigate('/modules/employees/salaries', { state: { activeTab: 'create' } });
  };

  const handleOpenConfiguration = () => {
    // Could navigate to settings or show settings dialog
    toast.info('Configuration des fiches de paie', {
      description: 'Cette fonctionnalité sera disponible prochainement'
    });
  };

  const handleExportData = () => {
    toast.info('Export des fiches de paie', {
      description: 'Cette fonctionnalité sera disponible prochainement'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p className="font-medium">Erreur de chargement</p>
          <p className="text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PayslipOperations 
        onFilter={handleFilterChange}
        currentFilters={filters}
        onOpenGenerator={handleOpenGenerator}
        onOpenConfiguration={handleOpenConfiguration}
        onExportData={handleExportData}
      />

      <Card>
        <CardContent className="p-6">
          {filteredPayslips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Employé</th>
                    <th className="text-left py-3 px-4">Période</th>
                    <th className="text-left py-3 px-4">Montant Net</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayslips.map((payslip) => (
                    <tr key={payslip.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{payslip.employeeName || 'Employé inconnu'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {payslip.month} {payslip.year}
                      </td>
                      <td className="py-3 px-4">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: payslip.currency || 'EUR'
                        }).format(payslip.netAmount || payslip.netSalary || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payslip.status === 'Validé' ? 'bg-green-100 text-green-800' :
                          payslip.status === 'Envoyé' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payslip.status || 'Généré'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <File className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune fiche de paie</h3>
              <p className="mt-1 text-sm text-gray-500">
                Il n'y a pas encore de fiches de paie ou aucune ne correspond aux filtres sélectionnés.
              </p>
              <div className="mt-6">
                <Button onClick={handleOpenGenerator}>
                  Générer une fiche de paie
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayslipList;
