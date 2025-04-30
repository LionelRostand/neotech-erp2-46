
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Contract } from '@/hooks/useContractsData';
import { generateContractPdf } from './utils/contractPdfUtils';
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface GeneratePdfButtonProps {
  contract: Contract;
  onSuccess?: () => void;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({ contract, onSuccess }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  // On récupère les données de l'employé directement depuis le hook central
  const { employees } = useHrModuleData();

  // Helper function to safely stringify any object
  const ensureString = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const handleGeneratePdf = async () => {
    if (!contract) return;
    
    setIsGenerating(true);
    try {
      // Ensure we have a valid contract object with string values where needed
      const safeContract = {
        ...contract,
        employeeName: ensureString(contract.employeeName),
        position: ensureString(contract.position),
        type: ensureString(contract.type),
        status: ensureString(contract.status),
        department: ensureString(contract.department)
      };
      
      // Trouver l'employé correspondant au contrat
      const employee = employees?.find(emp => emp.id === contract.employeeId);
      
      if (!employee) {
        toast.error("Impossible de trouver les informations de l'employé");
        setIsGenerating(false);
        return;
      }
      
      const success = await generateContractPdf(safeContract, employee);
      
      if (success) {
        toast.success("Le PDF du contrat a été généré avec succès");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Erreur lors de la génération du PDF du contrat");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleGeneratePdf} 
      disabled={isGenerating} 
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      {isGenerating ? 'Génération...' : 'Générer PDF'}
    </Button>
  );
};

export default GeneratePdfButton;
