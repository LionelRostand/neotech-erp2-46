
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Contract } from '@/hooks/useContractsData';
import { generateContractPdf } from './utils/contractPdfUtils';
import { toast } from 'sonner';

interface GeneratePdfButtonProps {
  contract: Contract;
  onSuccess?: () => void;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({ contract, onSuccess }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGeneratePdf = async () => {
    if (!contract) return;
    
    setIsGenerating(true);
    try {
      const success = await generateContractPdf(contract);
      
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
