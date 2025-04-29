
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { generateBadgePdf, getCompanyName } from './utils/badgePdfUtils';
import BadgePreview from './components/BadgePreview';
import BadgeActions from './components/BadgeActions';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBadge: BadgeData | null;
  selectedEmployee: Employee | null;
  onDeleteClick?: (badge: BadgeData) => void;
}

const BadgePreviewDialog: React.FC<BadgePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBadge,
  selectedEmployee,
  onDeleteClick
}) => {
  const [isPrinted, setIsPrinted] = useState(false);
  
  // Early return with null if no badge is selected
  if (!isOpen || !selectedBadge) return null;
  
  // Get company name from employee or use a default
  const companyName = getCompanyName(selectedEmployee);
  
  const handleDownloadBadge = () => {
    try {
      const doc = generateBadgePdf(selectedBadge, selectedEmployee, companyName);
      doc.save(`badge-${selectedBadge.id || 'unknown'}.pdf`);
      
      toast.success("Badge téléchargé avec succès");
      setIsPrinted(true);
    } catch (error) {
      console.error("Erreur lors du téléchargement du badge:", error);
      toast.error("Erreur lors du téléchargement du badge");
    }
  };
  
  const handlePrintBadge = () => {
    try {
      handleDownloadBadge();
      toast.success("Badge imprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'impression du badge:", error);
      toast.error("Erreur lors de l'impression du badge");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du Badge</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <BadgePreview 
            badge={selectedBadge} 
            companyName={companyName} 
            employee={selectedEmployee} 
          />
          
          <BadgeActions 
            onDownload={handleDownloadBadge} 
            onPrint={handlePrintBadge} 
            onDelete={onDeleteClick ? () => onDeleteClick(selectedBadge) : undefined}
            badge={selectedBadge}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
