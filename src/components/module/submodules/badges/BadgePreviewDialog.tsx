import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { jsPDF } from 'jspdf';
import { Company } from '@/components/module/submodules/companies/types';

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
  
  const getCompanyName = (): string => {
    if (!selectedEmployee) return "Enterprise";
    
    if (!selectedEmployee.company) return "Enterprise";
    
    if (typeof selectedEmployee.company === 'string') {
      return selectedEmployee.company;
    }
    
    const companyObj = selectedEmployee.company as Company;
    return companyObj.name || "Enterprise";
  };
  
  const companyName = getCompanyName();
  
  const handleDownloadBadge = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54]
    });
    
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85, 54, 'F');
    
    let headerColor;
    if (selectedBadge.status === 'success') {
      headerColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      headerColor = [234, 179, 8];
    } else {
      headerColor = [239, 68, 68];
    }
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, 85, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName.toUpperCase(), 5, 7);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`ID: ${selectedBadge.id}`, 42.5, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 42.5, 25, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 42.5, 31, { align: 'center' });
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 42.5, 36, { align: 'center' });
    
    let statusColor;
    if (selectedBadge.status === 'success') {
      statusColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      statusColor = [234, 179, 8];
    } else {
      statusColor = [239, 68, 68];
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Statut: ${selectedBadge.statusText}`, 42.5, 41, { align: 'center' });
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Email: ${selectedEmployee?.professionalEmail || 'N/A'}`, 42.5, 46, { align: 'center' });
    
    doc.setFillColor(70, 70, 70);
    doc.rect(0, 50, 85, 4, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('Ce badge doit être porté visiblement à tout moment', 42.5, 52.5, { align: 'center' });
    
    doc.setFillColor(0, 0, 0);
    doc.rect(5, 36, 10, 10, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(6, 37, 8, 8, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(7, 38, 6, 6, 'F');

    doc.save(`badge-${selectedBadge.id}.pdf`);
    
    toast.success("Badge téléchargé avec succès");
    setIsPrinted(true);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du Badge</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-100 rounded-md p-6 mb-4">
            <div className={`h-2 w-full mb-3 rounded-t ${
              selectedBadge.status === 'success' ? 'bg-green-500' : 
              selectedBadge.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            
            <div className="text-center mb-3">
              <p className="text-sm text-gray-500">ID: {selectedBadge.id}</p>
              <h3 className="text-lg font-bold">{selectedBadge.employeeName}</h3>
              <p className="text-sm text-gray-600">Entreprise: {companyName}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Département:</span> {selectedBadge.department || 'N/A'}</p>
              <p><span className="font-medium">Niveau d'accès:</span> {selectedBadge.accessLevel || 'Standard'}</p>
              <p><span className="font-medium">Statut:</span> 
                <span className={`ml-1 ${
                  selectedBadge.status === 'success' ? 'text-green-600' : 
                  selectedBadge.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {selectedBadge.statusText}
                </span>
              </p>
              <p><span className="font-medium">Date d'émission:</span> {selectedBadge.date}</p>
            </div>
            
            {selectedEmployee && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Informations supplémentaires</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email professionnel:</span> {selectedEmployee.professionalEmail || 'Non spécifié'}</p>
                  <p><span className="font-medium">Poste:</span> {selectedEmployee.position}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDownloadBadge} 
              className="flex-1" 
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le badge
            </Button>
            
            <Button
              onClick={() => {
                handleDownloadBadge();
                toast.success("Badge imprimé avec succès");
              }}
              className="flex-1"
              variant="default"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimer le badge
            </Button>
            
            {onDeleteClick && selectedBadge && (
              <Button 
                onClick={() => onDeleteClick(selectedBadge)}
                variant="destructive"
                className="flex-shrink-0"
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
