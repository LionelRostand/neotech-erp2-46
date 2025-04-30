
import React from 'react';
import { Employee } from '@/types/employee';
import { 
  Briefcase, 
  Building, 
  Calendar, 
  Mail, 
  MapPin, 
  Phone, 
  User
} from 'lucide-react';
import { formatPhoneNumber, formatDate, calculateAge } from '../utils/employeeUtils';

interface InformationsTabProps {
  employee: Employee & {
    departmentName?: string;
    managerName?: string;
    companyName?: string;
  };
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  // Calculer l'âge si date de naissance disponible
  const age = employee.birthDate ? calculateAge(employee.birthDate) : null;
  
  // Formatage de l'adresse complète
  const formatAddress = () => {
    // Si l'adresse est un objet complet
    if (typeof employee.address === 'object' && employee.address) {
      const { street, city, postalCode, country } = employee.address;
      return [street, city, postalCode, country].filter(Boolean).join(', ');
    }
    
    // Si les champs d'adresse sont séparés
    const addressParts = [
      employee.streetNumber && employee.streetName 
        ? `${employee.streetNumber} ${employee.streetName}`
        : (employee.streetName || ''),
      employee.city,
      employee.zipCode || employee.postalCode,
      employee.region,
      employee.country
    ];
    
    return addressParts.filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p>{employee.firstName} {employee.lastName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email personnel</p>
              <p>{employee.email || 'Non spécifié'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p>{formatPhoneNumber(employee.phone) || 'Non spécifié'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p>
                {employee.birthDate 
                  ? `${formatDate(employee.birthDate)}${age ? ` (${age} ans)` : ''}`
                  : 'Non spécifiée'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:col-span-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p>{formatAddress() || 'Non spécifiée'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Poste</p>
              <p>{employee.position || 'Non spécifié'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email professionnel</p>
              <p>{employee.professionalEmail || employee.email || 'Non spécifié'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p>{employee.departmentName || 'Non spécifié'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Entreprise</p>
              <p>{employee.companyName || 'Non spécifiée'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Responsable</p>
              <p>{employee.managerName || 'Aucun responsable'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Date d'embauche</p>
              <p>{employee.hireDate ? formatDate(employee.hireDate) : 'Non spécifiée'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Type de contrat</p>
              <p>{employee.contract ? employee.contract.toUpperCase() : 'Non spécifié'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationsTab;
