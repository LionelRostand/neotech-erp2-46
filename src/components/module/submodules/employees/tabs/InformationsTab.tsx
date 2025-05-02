
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Pencil } from 'lucide-react';
import EditEmployeeInfoDialog from './EditEmployeeInfoDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

interface InformationsTabProps {
  employee: Employee | null;
  isLoading?: boolean;
  onEmployeeUpdate?: () => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  isLoading = false,
  onEmployeeUpdate 
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { departments } = useAvailableDepartments();
  
  // Find the department name based on department ID
  const departmentName = useMemo(() => {
    if (!employee || !departments || departments.length === 0) return "Non renseigné";
    
    // Try to match by ID first (if it's an ID)
    const departmentById = departments.find(dept => 
      dept.id === employee.department || 
      dept.id === employee.departmentId
    );
    
    if (departmentById) return departmentById.name;
    
    // If not found by ID, check if the department field is already a name
    const departmentByName = departments.find(dept => 
      dept.name === employee.department
    );
    
    if (departmentByName) return departmentByName.name;
    
    // Return the department field value or a fallback
    return employee.department || "Non renseigné";
  }, [employee, departments]);

  if (isLoading) {
    return <div className="p-4">Chargement des informations...</div>;
  }

  if (!employee) {
    return <div className="p-4">Aucune information disponible</div>;
  }

  const handleEditSuccess = () => {
    // Invalidate employee data to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['employees'] });
    if (onEmployeeUpdate) {
      onEmployeeUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Informations personnelles</h3>
        <Button 
          onClick={() => setEditDialogOpen(true)} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Pencil size={16} />
          <span>Modifier</span>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Nom complet</h4>
              <p>{employee.firstName} {employee.lastName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
              <p>{employee.email || "Non renseigné"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Téléphone</h4>
              <p>{employee.phone || "Non renseigné"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Date de naissance</h4>
              <p>{employee.birthDate || "Non renseigné"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Numéro de sécurité sociale</h4>
              <p>{employee.socialSecurityNumber || "Non renseigné"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3">Adresse</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Adresse</h4>
                <p>{employee.address?.street || "Non renseigné"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Ville</h4>
                <p>{employee.address?.city || "Non renseigné"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Code postal</h4>
                <p>{employee.address?.postalCode || "Non renseigné"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Pays</h4>
                <p>{employee.address?.country || "Non renseigné"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Informations professionnelles</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Poste</h4>
                <p>{employee.position || employee.role || "Non renseigné"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Département</h4>
                <p>{departmentName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email professionnel</h4>
                <p>{employee.professionalEmail || employee.email || "Non renseigné"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Date d'embauche</h4>
                <p>{employee.hireDate || employee.startDate || "Non renseigné"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      {employee && (
        <EditEmployeeInfoDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          employee={employee}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default InformationsTab;
