
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Pencil, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';
import { EditCompanyPositionDialog } from './EditCompanyPositionDialog';
import { exportEmployeePdf } from './utils/employeePdfUtils';
import { toast } from 'sonner';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ 
  employee, 
  onEmployeeUpdate 
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employee);

  const getInitials = () => {
    return `${currentEmployee.firstName?.charAt(0) || ''}${currentEmployee.lastName?.charAt(0) || ''}`;
  };

  const getStatusBadge = () => {
    switch (currentEmployee.status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Inactif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En congé</Badge>;
      case 'Suspendu':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{currentEmployee.status}</Badge>;
    }
  };

  const getCompanyName = () => {
    if (!currentEmployee.company) return 'Non spécifiée';
    
    if (typeof currentEmployee.company === 'string') {
      return currentEmployee.company;
    }
    
    return currentEmployee.company.name || 'Non spécifiée';
  };

  const handleEmployeeUpdated = (updatedEmployee: Employee) => {
    setCurrentEmployee(updatedEmployee);
    
    if (onEmployeeUpdate) {
      onEmployeeUpdate(updatedEmployee);
    }
  };

  const handleExportPdf = () => {
    try {
      const success = exportEmployeePdf(currentEmployee);
      if (success) {
        toast.success("Le profil a été exporté en PDF avec succès");
      } else {
        toast.error("Erreur lors de l'exportation du PDF");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erreur lors de l'exportation du PDF");
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 border-2 border-primary/10 mb-2">
              <AvatarImage 
                src={currentEmployee.photoURL || currentEmployee.photo} 
                alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`} 
              />
              <AvatarFallback className="text-xl bg-primary/10">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold">{currentEmployee.firstName} {currentEmployee.lastName}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {currentEmployee.position || 'Poste non spécifié'} @ {getCompanyName()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-end p-4 pt-0">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Modifier
          </Button>
          <Button
            variant="outline" 
            size="sm"
            onClick={handleExportPdf}
          >
            <FileText className="h-4 w-4 mr-1" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <EditCompanyPositionDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        employee={currentEmployee}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    </Card>
  );
};

export default EmployeeProfileHeader;
