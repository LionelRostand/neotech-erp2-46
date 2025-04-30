
import React from 'react';
import { Employee } from '@/types/employee';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building, 
  Calendar, 
  MapPin,
  GraduationCap,
  Users
} from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
}

export const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  // Formatter la date d'embauche
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Format invalide';
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations professionnelles */}
      <div>
        <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Poste</p>
                <p className="font-medium">{employee.position || 'Non spécifié'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email professionnel</p>
                <p className="font-medium">{employee.professionalEmail || employee.email || 'Non spécifié'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Type de contrat</p>
                <p className="font-medium">{employee.contract || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Département</p>
                <p className="font-medium">{employee.department || 'Non spécifié'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date d'embauche</p>
                <p className="font-medium">{formatDate(employee.hireDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="font-medium">{employee.manager || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informations personnelles */}
      <div>
        <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email personnel</p>
                <p className="font-medium">{employee.email || 'Non spécifié'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{employee.phone || 'Non spécifié'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date de naissance</p>
                <p className="font-medium">{formatDate(employee.birthDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <div>
                  {typeof employee.address === 'object' ? (
                    <p className="font-medium">
                      {employee.address?.street || employee.streetNumber + ' ' + employee.streetName || 'Adresse non spécifiée'}
                    </p>
                  ) : (
                    <p className="font-medium">{employee.address || 'Adresse non spécifiée'}</p>
                  )}
                  <p className="font-medium">
                    {employee.zipCode || employee.postalCode} {employee.city}
                  </p>
                  <p className="font-medium">
                    {employee.region && `${employee.region}, `}{employee.country || 'Pays non spécifié'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
