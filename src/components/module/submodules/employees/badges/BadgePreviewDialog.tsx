
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { AlignJustify, Building, Calendar, User, ShieldCheck, Info, Trash2, Printer, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
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
  if (!selectedBadge) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleDelete = () => {
    if (onDeleteClick && selectedBadge) {
      onDeleteClick(selectedBadge);
    }
  };

  const handlePrintBadge = () => {
    if (!selectedBadge) return;
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54] // Format standard de carte de badge
    });
    
    // Fond du badge
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85, 54, 'F');
    
    // En-tête coloré
    let headerColor;
    if (selectedBadge.status === 'success') {
      headerColor = [34, 197, 94]; // Vert
    } else if (selectedBadge.status === 'warning') {
      headerColor = [234, 179, 8]; // Jaune
    } else {
      headerColor = [239, 68, 68]; // Rouge
    }
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, 85, 12, 'F');
    
    // Nom de l'entreprise en en-tête
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.company || 'ENTREPRISE', 5, 7);
    
    // Numéro de badge
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`ID: ${selectedBadge.id}`, 42.5, 18, { align: 'center' });
    
    // Nom de l'employé
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedBadge.employeeName, 42.5, 25, { align: 'center' });
    
    // Département et niveau d'accès
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Département: ${selectedBadge.department || 'N/A'}`, 42.5, 31, { align: 'center' });
    doc.text(`Accès: ${selectedBadge.accessLevel || 'Standard'}`, 42.5, 36, { align: 'center' });
    
    // Email (si disponible)
    if (selectedEmployee?.email) {
      doc.setFontSize(7);
      doc.text(`Email: ${selectedEmployee.email}`, 42.5, 41, { align: 'center' });
    }
    
    // Statut du badge
    let statusColor;
    if (selectedBadge.status === 'success') {
      statusColor = [34, 197, 94];
    } else if (selectedBadge.status === 'warning') {
      statusColor = [234, 179, 8];
    } else {
      statusColor = [239, 68, 68];
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(8);
    doc.text(`Statut: ${selectedBadge.statusText}`, 42.5, 45, { align: 'center' });
    
    // Date d'émission
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text(`Émis le: ${selectedBadge.date}`, 42.5, 49, { align: 'center' });
    
    // Pied de page
    doc.setFillColor(70, 70, 70);
    doc.rect(0, 50, 85, 4, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('Ce badge doit être porté visiblement à tout moment', 42.5, 52.5, { align: 'center' });
    
    // Symbole QR code (simplifié)
    doc.setFillColor(0, 0, 0);
    doc.rect(5, 36, 10, 10, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(6, 37, 8, 8, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(7, 38, 6, 6, 'F');

    // Enregistrer le PDF
    doc.save(`badge-${selectedBadge.id}.pdf`);
    
    toast.success("Badge imprimé avec succès");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>Détails du badge</div>
            {onDeleteClick && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6 p-2">
            <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
              <Avatar className="h-24 w-24 mb-4">
                {selectedEmployee?.photoURL ? (
                  <AvatarImage src={selectedEmployee.photoURL} alt={selectedBadge.employeeName} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(selectedBadge.employeeName)}</AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-xl font-bold mb-1">{selectedBadge.employeeName}</h3>
              <p className="text-muted-foreground">{selectedBadge.department}</p>
              <div className="mt-4 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                <span className="text-primary font-medium">{selectedBadge.accessLevel}</span>
              </div>
              {selectedEmployee?.email && (
                <div className="mt-2 flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedEmployee.email}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Numéro de badge
                </p>
                <p className="font-medium">{selectedBadge.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date de création
                </p>
                <p className="font-medium">{selectedBadge.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  ID Employé
                </p>
                <p className="font-medium">{selectedBadge.employeeId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Entreprise
                </p>
                <p className="font-medium">{selectedBadge.company || "Non spécifiée"}</p>
              </div>
            </div>
            
            {selectedEmployee && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Informations supplémentaires</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedEmployee.email && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                  )}
                  {selectedEmployee.phone && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{selectedEmployee.phone}</p>
                    </div>
                  )}
                  {selectedEmployee.position && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Poste</p>
                      <p className="font-medium">{selectedEmployee.position}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
          <Button variant="secondary" onClick={handlePrintBadge}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer le badge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
