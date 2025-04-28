
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Employee } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({ employee, isOpen, onClose }) => {
  if (!employee) return null;

  // Format the hire date if it exists
  const formattedHireDate = employee.hireDate 
    ? format(new Date(employee.hireDate.split('/').reverse().join('-')), 'dd MMMM yyyy', { locale: fr })
    : 'Non spécifié';

  // Format status for display
  const getStatusLabel = (status: string | undefined) => {
    switch(status) {
      case 'active': 
      case 'Actif': return 'Actif';
      case 'inactive': 
      case 'Inactif': return 'Inactif';
      case 'onLeave': 
      case 'En congé': return 'En congé';
      case 'Suspendu': return 'Suspendu';
      default: return 'Non spécifié';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Détails de l'employé
          </DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm p-0 h-auto"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            {employee.photoURL ? (
              <img 
                src={employee.photoURL} 
                alt={`${employee.firstName} ${employee.lastName}`} 
                className="h-24 w-24 rounded-full object-cover border"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Informations personnelles</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nom:</span> {employee.firstName} {employee.lastName}</p>
                <p><span className="font-medium">Email:</span> {employee.email}</p>
                <p><span className="font-medium">Téléphone:</span> {employee.phone || 'Non spécifié'}</p>
                <p><span className="font-medium">Date d'embauche:</span> {formattedHireDate}</p>
                <p><span className="font-medium">Statut:</span> {getStatusLabel(employee.status)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Informations professionnelles</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Poste:</span> {employee.position || 'Non spécifié'}</p>
                <p><span className="font-medium">Département:</span> {employee.department || 'Non spécifié'}</p>
                <p><span className="font-medium">Type de contrat:</span> {employee.contract || 'Non spécifié'}</p>
                <p><span className="font-medium">Manager:</span> {employee.manager || 'Non spécifié'}</p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-sm font-medium text-gray-500">Compétences</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {employee.skills && employee.skills.length > 0 ? (
                employee.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucune compétence spécifiée</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
