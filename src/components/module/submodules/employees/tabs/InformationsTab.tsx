
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Employee } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import EditEmployeeInfoDialog from './EditEmployeeInfoDialog';

interface InformationsTabProps {
  employee: Employee | null;
  onEmployeeUpdate?: () => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({
  employee,
  onEmployeeUpdate
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { getDepartmentName } = useAvailableDepartments();

  if (!employee) {
    return <div className="p-6">Chargement des informations...</div>;
  }

  // Format date if exists
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifié';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };

  // Get department name
  const departmentName = employee.departmentId ? 
    getDepartmentName(employee.departmentId) : 
    (typeof employee.department === 'string' ? employee.department : 'Non spécifié');

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleUpdateSuccess = () => {
    if (onEmployeeUpdate) {
      onEmployeeUpdate();
    }
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Informations de l'employé</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleOpenEditDialog}
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Informations personnelles</h4>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Nom</dt>
                <dd className="col-span-2 font-medium">{employee.firstName} {employee.lastName}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Email</dt>
                <dd className="col-span-2">{employee.email}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Téléphone</dt>
                <dd className="col-span-2">{employee.phone || 'Non spécifié'}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Date de naissance</dt>
                <dd className="col-span-2">{formatDate(employee.birthDate)}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium mb-4">Informations professionnelles</h4>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Poste</dt>
                <dd className="col-span-2">{employee.position || employee.role || 'Non spécifié'}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Département</dt>
                <dd className="col-span-2">{departmentName}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Date d'embauche</dt>
                <dd className="col-span-2">{formatDate(employee.hireDate)}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-gray-500">Statut</dt>
                <dd className="col-span-2 capitalize">{employee.status || 'Non spécifié'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      {isEditDialogOpen && (
        <EditEmployeeInfoDialog 
          isOpen={isEditDialogOpen} 
          onClose={handleCloseEditDialog} 
          employee={employee}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default InformationsTab;
