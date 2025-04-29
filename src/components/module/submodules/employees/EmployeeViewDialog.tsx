
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { FileText, Mail, Phone, FileIcon } from 'lucide-react';
import { exportEmployeePdf } from './utils/employeePdfUtils';
import { toast } from 'sonner';

export interface EmployeeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onEdit: () => void;
}

const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onEdit
}) => {
  const handleExportPdf = () => {
    try {
      const success = exportEmployeePdf(employee);
      if (success) {
        toast.success('PDF exporté avec succès');
      } else {
        toast.error('Erreur lors de l\'exportation du PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Erreur lors de l\'exportation du PDF');
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Fiche employé</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'employé
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left column - Photo and basic info */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={employee.photo || employee.photoURL} />
              <AvatarFallback className="text-xl">
                {getInitials(`${employee.firstName} ${employee.lastName}`)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h3>
              <p className="text-muted-foreground">{employee.position}</p>
              {employee.company && (
                <p className="text-sm text-muted-foreground">
                  {typeof employee.company === 'string' ? employee.company : employee.company.name}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                Modifier
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <FileIcon className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
          
          {/* Right column - Detailed info */}
          <div className="col-span-2 space-y-6">
            {/* Contact info */}
            <div>
              <h4 className="font-medium border-b pb-2 mb-3">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                {employee.professionalEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.professionalEmail}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Employment info */}
            <div>
              <h4 className="font-medium border-b pb-2 mb-3">Information professionnelle</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p>{employee.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contrat</p>
                  <p>{employee.contract}</p>
                </div>
                {employee.hireDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'embauche</p>
                    <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Documents section */}
            <div>
              <h4 className="font-medium border-b pb-2 mb-3">Documents</h4>
              {employee.documents && employee.documents.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {employee.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{doc.name || 'Document'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun document disponible</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
