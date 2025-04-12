
import React from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin } from 'lucide-react';

interface EmployeeProfileHeaderProps {
  employee: Employee;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee }) => {
  // Format address to display
  const formatAddress = (address: string | EmployeeAddress): string => {
    if (typeof address === 'string') {
      return address;
    } else {
      const { street, city, postalCode, country } = address;
      return `${street}, ${postalCode} ${city}, ${country}`;
    }
  };

  // Get employee initials for avatar fallback
  const getInitials = (): string => {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  };

  // Get status color for badge
  const getStatusColor = (): string => {
    switch (employee.status) {
      case 'active':
      case 'Actif':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'onLeave':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
            <p className="text-muted-foreground">{employee.position || employee.title}</p>
            
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="outline" className={getStatusColor()}>
                {employee.status === 'active' || employee.status === 'Actif' ? 'Actif' : 
                 employee.status === 'inactive' ? 'Inactif' : 
                 employee.status === 'onLeave' ? 'En congé' : employee.status}
              </Badge>
              <Badge variant="outline">{employee.department}</Badge>
              <Badge variant="outline">{employee.contract || 'CDI'}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formatAddress(employee.address)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileHeader;
