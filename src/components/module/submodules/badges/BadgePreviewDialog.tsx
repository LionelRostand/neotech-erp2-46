
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { jsPDF } from 'jspdf';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBadge: BadgeData | null;
  selectedEmployee: Employee | null;
}

const BadgePreviewDialog: React.FC<BadgePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBadge,
  selectedEmployee
}) => {
  if (!selectedBadge) return null;
  
  const handleDownloadBadge = () => {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85, 54] // ID card size (85mm x 54mm)
    });
    
    // Set background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85, 54, 'F');
    
    // Add company logo/header
    doc.setFillColor(selectedBadge.status === 'success' ? 34, 197, 94 : 
                     selectedBadge.status === 'warning' ? 234, 179, 8 : 239, 68, 68);
    doc.rect(0, 0, 85, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Enterprise Solutions', 42.5, 6, { align: 'center' });
    
    // Add badge ID
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`ID: ${selectedBadge.id}`, 42.5, 15, { align: 'center' });
    
    // Add employee name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 42.5, 22, { align: 'center' });
    
    // Add employee details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 42.5, 28, { align: 'center' });
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 42.5, 33, { align: 'center' });
    
    // Add status
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(
      selectedBadge.status === 'success' ? 34 : 
      selectedBadge.status === 'warning' ? 234 : 239,
      
      selectedBadge.status === 'success' ? 197 : 
      selectedBadge.status === 'warning' ? 179 : 68,
      
      selectedBadge.status === 'success' ? 94 : 
      selectedBadge.status === 'warning' ? 8 : 68
    );
    doc.text(`Statut: ${selectedBadge.statusText}`, 42.5, 38, { align: 'center' });
    
    // Add date
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Émis le: ${selectedBadge.date}`, 42.5, 45, { align: 'center' });
    
    // Add company footer
    doc.setFillColor(70, 70, 70);
    doc.rect(0, 50, 85, 4, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('Ce badge doit être porté visiblement à tout moment', 42.5, 52.5, { align: 'center' });
    
    // Save the PDF
    doc.save(`badge-${selectedBadge.id}.pdf`);
    
    toast.success("Badge téléchargé avec succès");
  };
  
  return (
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
        
        <Button 
          onClick={handleDownloadBadge} 
          className="w-full" 
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger le badge
        </Button>
      </div>
    </DialogContent>
  );
};

export default BadgePreviewDialog;
