import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ 
  employee, 
  onEmployeeUpdate 
}) => {
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
    console.log("Photo data:", employee.photoData);
    console.log("Photo URL:", employee.photoURL);
    console.log("Photo:", employee.photo);
    
    if (employee.photoData && typeof employee.photoData === 'string' && employee.photoData.startsWith('data:')) {
      return employee.photoData;
    }

    if (employee.photoURL && typeof employee.photoURL === 'string' && employee.photoURL.length > 0) {
      return employee.photoURL;
    }

    if (employee.photo && typeof employee.photo === 'string' && employee.photo.length > 0) {
      return employee.photo;
    }

    if (employee.photoData && typeof employee.photoData === 'object' && 
        employee.photoData !== null) {
      const photoDataObj = employee.photoData as Record<string, unknown>;
      if ('data' in photoDataObj && typeof photoDataObj.data === 'string') {
        return photoDataObj.data;
      }
    }
    
    return '';
  };

  const getFormattedAddress = () => {
    if (typeof employee.address === 'object') {
      const addr = employee.address;
      return `${addr.street || ''}, ${addr.postalCode || ''} ${addr.city || ''}, ${addr.country || ''}`;
    }
    return employee.address || '';
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="w-24 h-24 border-2 border-primary/10">
            <AvatarImage 
              src={getPhotoUrl()} 
              alt={`${employee.firstName} ${employee.lastName}`} 
            />
            <AvatarFallback className="text-xl bg-primary/10">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
                <p className="text-muted-foreground">{employee.position || employee.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{employee.department}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone || 'Non renseigné'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{employee.professionalEmail || employee.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{getFormattedAddress()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileHeader;
