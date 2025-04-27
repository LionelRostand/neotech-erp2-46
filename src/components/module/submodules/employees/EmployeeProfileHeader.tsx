
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';
import { EditCompanyPositionDialog } from './EditCompanyPositionDialog';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ 
  employee, 
  onEmployeeUpdate 
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getInitials = () => {
    return `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`;
  };

  const getStatusBadge = () => {
    switch (employee.status) {
      case 'active':
      case 'Actif':
        return <Badge variant="success">Actif</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Inactif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge variant="warning">En congé</Badge>;
      case 'Suspendu':
        return <Badge variant="danger">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{employee.status}</Badge>;
    }
  };

  const getCompanyName = () => {
    if (!employee.company) return 'Non spécifiée';
    
    if (typeof employee.company === 'string') {
      return employee.company;
    }
    
    return employee.company.name || 'Non spécifiée';
  };

  const handleEmployeeUpdated = (updatedEmployee: Employee) => {
    if (onEmployeeUpdate) {
      onEmployeeUpdate(updatedEmployee);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 border-2 border-primary/10 mb-2">
              <AvatarImage 
                src={employee.photoURL || employee.photo} 
                alt={`${employee.firstName} ${employee.lastName}`} 
              />
              <AvatarFallback className="text-xl bg-primary/10">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {employee.position || 'Poste non spécifié'} @ {getCompanyName()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                    className="ml-2"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <EditCompanyPositionDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        employee={employee}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    </Card>
  );
};

export default EmployeeProfileHeader;
