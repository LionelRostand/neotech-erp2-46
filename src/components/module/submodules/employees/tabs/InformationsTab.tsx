
import React from 'react';
import { Employee } from '@/types/employee';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  Calendar,
  User
} from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  // Format address for display
  const formatAddress = (employee: Employee) => {
    if (typeof employee.address === 'object' && employee.address) {
      const addr = employee.address;
      return [
        addr.street,
        addr.city,
        addr.postalCode,
        addr.country
      ].filter(Boolean).join(', ');
    } else if (employee.streetName) {
      return [
        `${employee.streetNumber || ''} ${employee.streetName}`,
        employee.city,
        employee.zipCode || employee.postalCode,
        employee.region,
        employee.country
      ].filter(Boolean).join(', ');
    }
    
    return employee.address || '-';
  };

  return (
    <div className="divide-y divide-gray-200">
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Poste</p>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.position || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Entreprise</p>
            <div className="flex items-center">
              <Building className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.companyName || employee.company || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Département</p>
            <div className="flex items-center">
              <Building className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.departmentName || employee.department || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Manager</p>
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.managerName || employee.manager || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email professionnel</p>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.professionalEmail || employee.email || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Date d'embauche</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p>{formatDate(employee.hireDate || employee.startDate)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Type de contrat</p>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.contract || '-'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Nom complet</p>
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.firstName} {employee.lastName}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email personnel</p>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.email || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Téléphone</p>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <p>{employee.phone || '-'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Date de naissance</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <p>{formatDate(employee.birthDate)}</p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-1">Adresse</p>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
              <p>{formatAddress(employee)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationsTab;
