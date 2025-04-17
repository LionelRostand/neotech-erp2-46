
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
  
  if (!selectedBadge) return null;
  
  const companyName = getCompanyName(selectedEmployee);
  
  const handleDownloadBadge = () => {
    const doc = generateBadgePdf(selectedBadge, selectedEmployee, companyName);
    doc.save(`badge-${selectedBadge.id}.pdf`);
    
    toast.success("Badge téléchargé avec succès");
    setIsPrinted(true);
  };
  
  const handlePrintBadge = () => {
    handleDownloadBadge();
    toast.success("Badge imprimé avec succès");
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
            onDelete={onDeleteClick}
            badge={selectedBadge}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
