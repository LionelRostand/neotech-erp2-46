
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { usePermissions } from '@/hooks/usePermissions';
import { Download, Trash } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

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
  const { isAdmin } = usePermissions('employees-badges');

  if (!selectedBadge) return null;

  const handleDownloadBadge = () => {
    // Create a new PDF document - using landscape format for badge display
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54] // ID card standard size (85mm x 54mm)
    });
    
    // Set background color for entire badge
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85, 54, 'F');
    
    // Add company header with status color
    let headerColor;
    if (selectedBadge.status === 'success') {
      headerColor = [34, 197, 94]; // green
    } else if (selectedBadge.status === 'warning') {
      headerColor = [234, 179, 8]; // amber
    } else {
      headerColor = [239, 68, 68]; // red
    }
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, 85, 12, 'F');
    
    // Company name and title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('STORM GROUP', 5, 7);
    doc.setFont('helvetica', 'normal');
    doc.text('Enterprise Solutions', 80, 7, { align: 'right' });
    
    // Employee details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 42.5, 25, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 42.5, 31, { align: 'center' });
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 42.5, 36, { align: 'center' });

    // Add photo placeholder or actual photo
    if (selectedEmployee?.photoURL) {
      // If we have a photo, we'll add it to the badge
      const photoSize = 20;
      const photoX = 5;
      const photoY = 25;
      doc.addImage(selectedEmployee.photoURL, 'JPEG', photoX, photoY, photoSize, photoSize);
    } else {
      // Add a placeholder box for photo
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(220, 220, 220);
      doc.roundedRect(5, 25, 20, 20, 2, 2, 'FD');
    }
    
    // Add badge ID and date
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID: ${selectedBadge.id}`, 42.5, 41, { align: 'center' });
    doc.text(`Émis le: ${selectedBadge.date}`, 42.5, 45, { align: 'center' });
    
    // Add QR code placeholder for future scanning
    doc.setFillColor(0, 0, 0);
    doc.rect(70, 25, 10, 10, 'F');
    
    // Add footer with company info
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du badge</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le badge d'accès.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {selectedEmployee?.photoURL ? (
                <img 
                  src={selectedEmployee.photoURL} 
                  alt={selectedBadge.employeeName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-2xl text-gray-400">
                    {selectedBadge.employeeName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">{selectedBadge.employeeName}</h3>
                {selectedEmployee?.department && (
                  <span className="text-sm text-muted-foreground">{selectedEmployee.department}</span>
                )}
              </div>
            </div>
            
            <Badge 
              variant={selectedBadge.status === 'success' ? 'default' : 
                     selectedBadge.status === 'warning' ? 'outline' : 
                     selectedBadge.status === 'danger' ? 'destructive' : 'secondary'}
            >
              {selectedBadge.statusText}
            </Badge>
          </div>
          
          <div className="space-y-2 rounded-md border p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">ID du badge</span>
              <span className="text-sm">{selectedBadge.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Date d'émission</span>
              <span className="text-sm">{selectedBadge.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Niveau d'accès</span>
              <span className="text-sm">{selectedBadge.accessLevel}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={handleDownloadBadge} className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </div>
          
          {isAdmin && onDeleteClick && (
            <Button 
              variant="destructive" 
              onClick={() => onDeleteClick(selectedBadge)}
              className="gap-2"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
