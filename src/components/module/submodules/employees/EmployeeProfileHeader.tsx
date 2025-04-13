
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
  // Fonction pour obtenir les initiales de l'employé
  const getInitials = () => {
    return `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`;
  };

  // Fonction pour définir le statut avec le bon style
  const getStatusBadge = () => {
    switch (employee.status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Inactif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-amber-500 hover:bg-amber-600">En congé</Badge>;
      case 'Suspendu':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{employee.status}</Badge>;
    }
  };

  // Sélectionner l'URL de la photo à utiliser
  const getPhotoUrl = () => {
    // On vérifie toutes les sources possibles de photos
    if (employee.photoData && typeof employee.photoData === 'string' && employee.photoData.startsWith('data:')) {
      // Utiliser la donnée base64 directement
      return employee.photoData;
    } else if (employee.photoURL && employee.photoURL.length > 0) {
      // Utiliser l'URL de la photo
      return employee.photoURL;
    } else if (employee.photo && employee.photo.length > 0) {
      // Utiliser l'ancienne propriété photo
      return employee.photo;
    } else if (employee.photoData && typeof employee.photoData === 'object' && employee.photoData.data) {
      // Si photoData est un objet avec une propriété data
      return employee.photoData.data;
    }
    
    // Aucune photo trouvée
    return '';
  };

  // Adresse formatée pour l'affichage
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
                <span>{employee.email}</span>
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
