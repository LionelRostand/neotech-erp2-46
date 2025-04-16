import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { jsPDF } from 'jspdf';
import { Company } from '@/components/module/submodules/companies/types';
import { useCompaniesData } from '@/hooks/useCompaniesData';

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
  const { companies } = useCompaniesData();
  
  if (!selectedBadge) return null;
  
  const getCompanyName = (): string => {
    if (!selectedEmployee) return "Enterprise";
    
    if (!selectedEmployee.company) return "Enterprise";
    
    if (typeof selectedEmployee.company === 'string') {
      const companyData = companies.find(c => c.id === selectedEmployee.company);
      return companyData?.name || selectedEmployee.company;
    }
    
    const companyObj = selectedEmployee.company as Company;
    return companyObj.name || companyObj.id || "Enterprise";
  };
  
  const companyName = getCompanyName();
  const employeeId = selectedEmployee?.id || 'N/A';
  
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
    
    if (selectedBadge.employeePhoto) {
      doc.setFillColor(200, 200, 200);
      doc.rect(5, 15, 20, 25, 'F');
    }
    
    doc.text(`Badge ID: ${selectedBadge.id}`, 30, 20);
    doc.text(`Employé ID: ${selectedBadge.employeeShortId || 'N/A'}`, 30, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 42.5, 30, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 42.5, 36, { align: 'center' });
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 42.5, 41, { align: 'center' });
    
    let statusColor;
    if (selectedBadge.status === 'success') {
      statusColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      statusColor = [234, 179, 8];
    } else {
      statusColor = [239, 68, 68];
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Statut: ${selectedBadge.statusText}`, 42.5, 46, { align: 'center' });
    
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
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du Badge</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-100 rounded-md p-6 mb-4">
            <div className={`h-8 w-full mb-3 rounded-t flex items-center px-3 ${
              selectedBadge.status === 'success' ? 'bg-green-500' : 
              selectedBadge.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              <span className="text-white font-bold text-sm">{selectedBadge.companyName.toUpperCase()}</span>
            </div>
            
            <div className="flex items-start space-x-4 mb-4">
              {selectedBadge.employeePhoto ? (
                <img 
                  src={selectedBadge.employeePhoto} 
                  alt={selectedBadge.employeeName}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Badge ID: {selectedBadge.id}</p>
                  <p className="text-sm text-gray-500">ID Employé: {selectedBadge.employeeShortId || 'N/A'}</p>
                </div>
                <h3 className="text-lg font-bold mt-2">{selectedBadge.employeeName}</h3>
                <p className="text-sm text-gray-600">Entreprise: {selectedBadge.companyName}</p>
              </div>
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
                  <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
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
