
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { Employee } from '@/types/employee';
import { exportEmployeeToPdf } from '../utils/employeePdfUtils';
import { toast } from 'sonner';

interface ExportEmployeePdfButtonProps {
  employee: Employee;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const ExportEmployeePdfButton = ({ 
  employee,
  variant = 'outline',
  size = 'default'
}: ExportEmployeePdfButtonProps) => {
  const handleExport = () => {
    try {
      const success = exportEmployeeToPdf(employee);
      
      if (success) {
        toast.success('Le PDF a été généré avec succès');
      } else {
        toast.error('Erreur lors de la génération du PDF');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
    >
      <FileDown className="h-4 w-4 mr-2" />
      Exporter PDF
    </Button>
  );
};

export default ExportEmployeePdfButton;
