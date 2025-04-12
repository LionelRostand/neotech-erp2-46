
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, Building } from 'lucide-react';
import { Employee } from '@/types/employee';
import PhotoUploader from './components/PhotoUploader';

interface EmployeeProfileHeaderProps {
  employee: Employee;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee }) => {
  const [photo, setPhoto] = useState(employee.photoURL || employee.photo || '');

  // Fonction pour formater la date (exemple: "20 janvier 2023")
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Calculer l'ancienneté
  const calculateTenure = (hireDateString?: string) => {
    if (!hireDateString) return 'Non spécifié';
    
    try {
      const hireDate = new Date(hireDateString);
      if (isNaN(hireDate.getTime())) return 'Date invalide';
      
      const now = new Date();
      let years = now.getFullYear() - hireDate.getFullYear();
      let months = now.getMonth() - hireDate.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      if (years === 0 && months === 0) {
        const days = Math.floor((now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} jour${days > 1 ? 's' : ''}`;
      } else if (years === 0) {
        return `${months} mois`;
      } else {
        return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
      }
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Gérer le fallback d'image
  const getInitials = () => {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  };

  const handlePhotoUpdated = (photoURL: string) => {
    setPhoto(photoURL);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex flex-col items-center">
          <PhotoUploader 
            employeeId={employee.id}
            currentPhoto={photo}
            employeeName={`${employee.firstName} ${employee.lastName}`}
            onPhotoUpdated={handlePhotoUpdated}
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
            <Badge 
              variant={employee.status === 'active' || employee.status === 'Actif' ? 'default' : 'secondary'}
              className="text-xs h-6"
            >
              {employee.status === 'active' || employee.status === 'Actif' ? 'Actif' : employee.status}
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-gray-500 text-sm">
            <span className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              {typeof employee.company === 'string' ? employee.company : employee.company?.name || 'Non spécifié'}
            </span>
            <span className="flex items-center">
              {employee.position || employee.title || 'Poste non spécifié'}
            </span>
            <span className="flex items-center">
              {employee.department || 'Département non spécifié'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-gray-500">Date d'embauche</p>
                <p>{formatDate(employee.hireDate || employee.startDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-gray-500">Email</p>
                <p className="break-all">{employee.email}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <p className="text-gray-500">Téléphone</p>
                <p>{employee.phone || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Ancienneté</p>
            <p className="font-bold text-lg">{calculateTenure(employee.hireDate || employee.startDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;
