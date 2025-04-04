
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Employee, Education } from '@/types/employee';
import { CalendarIcon, Briefcase, GraduationCap, MapPin, Mail, Phone } from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const education = employee.education || [];
  
  const formatEducation = (edu: Education) => {
    return `${edu.degree} - ${edu.school}, ${edu.year}`;
  };
  
  const formatAddress = (address?: { street?: string; city?: string; postalCode?: string; country?: string; }) => {
    if (!address) return 'Non spécifié';
    
    const parts = [
      address.street,
      address.city,
      address.postalCode,
      address.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Non spécifié';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-500">Date de naissance</Label>
              <div className="flex items-center mt-1">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                <span>{employee.birthDate || 'Non spécifié'}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Adresse</Label>
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{formatAddress(employee.address)}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Email</Label>
              <div className="flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span>{employee.email || 'Non spécifié'}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Téléphone</Label>
              <div className="flex items-center mt-1">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{employee.phone || 'Non spécifié'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-500">Poste</Label>
              <div className="mt-1">{employee.position || 'Non spécifié'}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Département</Label>
              <div className="mt-1">{employee.department || 'Non spécifié'}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Manager</Label>
              <div className="mt-1">{employee.manager || 'Non spécifié'}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Date d'embauche</Label>
              <div className="flex items-center mt-1">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                <span>{employee.hireDate || 'Non spécifié'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {education.length > 0 && (
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Formation</h3>
            
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="flex items-start">
                  <GraduationCap className="w-5 h-5 mr-3 mt-0.5 text-blue-500" />
                  <div>
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-sm text-gray-500">{edu.school}, {edu.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InformationsTab;
