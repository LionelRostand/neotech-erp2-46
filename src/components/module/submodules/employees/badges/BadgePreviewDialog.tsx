
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
  
  const getCompanyDetails = (): { name: string; details: Company | null } => {
    if (!selectedEmployee?.company) return { name: "Enterprise", details: null };
    
    if (typeof selectedEmployee.company === 'string') {
      const companyData = companies.find(c => c.id === selectedEmployee.company);
      return { 
        name: companyData?.name || "Enterprise",
        details: companyData || null
      };
    }
    
    const companyObj = selectedEmployee.company as Company;
    return { 
      name: companyObj.name || "Enterprise",
      details: companyObj
    };
  };
  
  const { name: companyName, details: companyDetails } = getCompanyDetails();
  const employeeId = selectedEmployee?.id 
    ? `E-${selectedEmployee.id.slice(-4)}` 
    : 'N/A';
  
  const handleDownloadBadge = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54]
    });
    
    // Header with company name
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
    
    // Employee Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`ID: ${employeeId}`, 5, 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 5, 25);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 5, 31);
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 5, 36);
    
    // Badge Status
    let statusColor;
    if (selectedBadge.status === 'success') {
      statusColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      statusColor = [234, 179, 8];
    } else {
      statusColor = [239, 68, 68];
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Statut: ${selectedBadge.statusText}`, 5, 41);
    
    // Date d'émission
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Émis le: ${selectedBadge.date}`, 5, 46);
    
    // Footer
    doc.setFillColor(70, 70, 70);
    doc.rect(0, 50, 85, 4, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('Ce badge doit être porté visiblement à tout moment', 42.5, 52.5, { align: 'center' });

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
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Informations de l'employé - Côté gauche */}
            <div className="space-y-2">
              <div className="bg-gray-100 rounded-md p-4">
                <h3 className="font-semibold text-sm mb-2">Informations Employé</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">ID:</span> {employeeId}</p>
                  <p><span className="font-medium">Nom:</span> {selectedBadge.employeeName}</p>
                  <p><span className="font-medium">Département:</span> {selectedBadge.department || 'N/A'}</p>
                  {selectedEmployee && (
                    <>
                      <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
                      <p><span className="font-medium">Poste:</span> {selectedEmployee.position}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Informations de l'entreprise - Côté droit */}
            <div className="space-y-2">
              <div className="bg-gray-100 rounded-md p-4">
                <h3 className="font-semibold text-sm mb-2">Informations Entreprise</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Nom:</span> {companyName}</p>
                  {companyDetails && (
                    <>
                      <p><span className="font-medium">Taille:</span> {companyDetails.size || 'N/A'}</p>
                      <p><span className="font-medium">Industrie:</span> {companyDetails.industry || 'N/A'}</p>
                      {companyDetails.address?.city && (
                        <p><span className="font-medium">Ville:</span> {companyDetails.address.city}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statut du badge et actions */}
          <div className="bg-gray-100 rounded-md p-4 mb-4">
            <div className={`mb-3 px-3 py-1 rounded text-sm inline-block ${
              selectedBadge.status === 'success' ? 'bg-green-100 text-green-800' : 
              selectedBadge.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              {selectedBadge.statusText}
            </div>
            <div className="text-sm">
              <p><span className="font-medium">Niveau d'accès:</span> {selectedBadge.accessLevel || 'Standard'}</p>
              <p><span className="font-medium">Date d'émission:</span> {selectedBadge.date}</p>
            </div>
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
