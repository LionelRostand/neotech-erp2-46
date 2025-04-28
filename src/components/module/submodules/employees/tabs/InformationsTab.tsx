
import React from 'react';
import { Employee } from '@/types/employee';
import { StatusBadge } from '@/components/ui/status-badge';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };
  
  // Helper to ensure values are strings and not objects
  const ensureString = (value: any) => {
    if (value === undefined || value === null) return '-';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };

  // Extract and convert employee properties safely to strings
  const firstName = ensureString(employee.firstName);
  const lastName = ensureString(employee.lastName);
  const birthDate = formatDate(ensureString(employee.birthDate));
  const email = ensureString(employee.email);
  const professionalEmail = ensureString(employee.professionalEmail);
  const phone = ensureString(employee.phone);
  const position = ensureString(employee.position);
  const department = ensureString(employee.department);
  const hireDate = formatDate(ensureString(employee.hireDate));
  const status = ensureString(employee.status);
  const contract = ensureString(employee.contract);

  // Format personal address
  const personalAddress = typeof employee.address === 'object' && employee.address
    ? `${employee.address.street || ''}, ${employee.address.city || ''}, ${employee.address.postalCode || ''}`
    : typeof employee.address === 'string' ? employee.address : 
      employee.streetNumber && employee.streetName 
      ? `${employee.streetNumber} ${employee.streetName}` 
      : '-';
  
  const personalCity = ensureString(employee.city);
  const personalPostalCode = ensureString(employee.postalCode || employee.zipCode);
  const personalCountry = ensureString(employee.country);
  
  // Format work address
  const hasWorkAddress = employee.workAddress && typeof employee.workAddress === 'object';
  const workStreet = hasWorkAddress ? ensureString(employee.workAddress.street) : '-';
  const workCity = hasWorkAddress ? ensureString(employee.workAddress.city) : '-';
  const workPostalCode = hasWorkAddress ? ensureString(employee.workAddress.postalCode) : '-';
  const workCountry = hasWorkAddress ? ensureString(employee.workAddress.country) : '-';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations personnelles</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Prénom</div>
            <div>{firstName}</div>
            
            <div className="text-gray-500">Nom</div>
            <div>{lastName}</div>
            
            <div className="text-gray-500">Date de naissance</div>
            <div>{birthDate}</div>
            
            <div className="text-gray-500">Email personnel</div>
            <div>{email}</div>
            
            <div className="text-gray-500">Email professionnel</div>
            <div>{professionalEmail}</div>
            
            <div className="text-gray-500">Téléphone</div>
            <div>{phone}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations professionnelles</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Poste</div>
            <div>{position}</div>
            
            <div className="text-gray-500">Département</div>
            <div>{department}</div>
            
            <div className="text-gray-500">Date d'embauche</div>
            <div>{hireDate}</div>
            
            <div className="text-gray-500">Statut</div>
            <div>
              <StatusBadge status={status}>
                {status}
              </StatusBadge>
            </div>
            
            <div className="text-gray-500">Type de contrat</div>
            <div>{contract}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Adresse personnelle</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Adresse</div>
            <div>{personalAddress}</div>
            
            <div className="text-gray-500">Ville</div>
            <div>{personalCity}</div>
            
            <div className="text-gray-500">Code postal</div>
            <div>{personalPostalCode}</div>
            
            <div className="text-gray-500">Pays</div>
            <div>{personalCountry}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Adresse professionnelle</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Adresse</div>
            <div>{workStreet}</div>
            
            <div className="text-gray-500">Ville</div>
            <div>{workCity}</div>
            
            <div className="text-gray-500">Code postal</div>
            <div>{workPostalCode}</div>
            
            <div className="text-gray-500">Pays</div>
            <div>{workCountry}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationsTab;
