
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Mail, Phone, MapPin, IdCard, Building2, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
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

  const getPhotoUrl = () => {
    const sources = [
      { name: 'photoData', value: employee.photoData },
      { name: 'photoURL', value: employee.photoURL },
      { name: 'photo', value: employee.photo }
    ];
    
    for (const source of sources) {
      if (source.value && typeof source.value === 'string' && source.value.length > 0) {
        console.log(`Utilisation de la source d'image: ${source.name}`);
        return source.value;
      }
    }

    console.log("Aucune source d'image valide trouvée pour l'employé:", employee.id);
    return '';
  };

  const getFormattedAddress = () => {
    const parts = [
      employee.streetNumber,
      employee.streetName,
      employee.city,
      employee.zipCode,
      employee.region
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Adresse non renseignée';
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
                src={getPhotoUrl()} 
                alt={`${employee.firstName} ${employee.lastName}`} 
              />
              <AvatarFallback className="text-xl bg-primary/10">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <IdCard className="h-4 w-4 mr-2" />
              <span>{employee.id || 'ID non disponible'}</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{employee.department || 'Département non spécifié'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone || 'Non renseigné'}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span title="Email personnel">{employee.email}</span>
                </div>
                {employee.professionalEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span title="Email professionnel">{employee.professionalEmail}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate" title={getFormattedAddress()}>{getFormattedAddress()}</span>
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
