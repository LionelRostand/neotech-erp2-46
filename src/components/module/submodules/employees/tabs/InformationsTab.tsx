
import React from 'react';
import { Employee } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mail, Phone, MapPin, Building2, Calendar, User, Briefcase } from 'lucide-react';

interface InformationsTabProps {
  employee: Employee & { 
    departmentName?: string;
    managerName?: string;
    companyName?: string;
  };
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
  <div className="flex items-start space-x-3 px-4 py-3 border-b last:border-0">
    <div className="text-gray-500">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="text-base">{value || '—'}</div>
    </div>
  </div>
);

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    return format(date, 'P', { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Informations professionnelles</h3>
        <div className="border rounded-md">
          <InfoItem 
            icon={<Briefcase className="h-5 w-5" />} 
            label="Poste" 
            value={employee.position || '—'} 
          />
          
          <InfoItem 
            icon={<Building2 className="h-5 w-5" />} 
            label="Département" 
            value={employee.departmentName || employee.department || '—'} 
          />
          
          <InfoItem 
            icon={<Mail className="h-5 w-5" />} 
            label="Email professionnel" 
            value={employee.professionalEmail || employee.email || '—'} 
          />
          
          <InfoItem 
            icon={<User className="h-5 w-5" />} 
            label="Responsable" 
            value={employee.managerName || '—'} 
          />
          
          <InfoItem 
            icon={<Building2 className="h-5 w-5" />} 
            label="Entreprise" 
            value={employee.companyName || '—'} 
          />
          
          <InfoItem 
            icon={<Calendar className="h-5 w-5" />} 
            label="Date d'embauche" 
            value={formatDate(employee.hireDate)} 
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
        <div className="border rounded-md">
          <InfoItem 
            icon={<Mail className="h-5 w-5" />} 
            label="Email personnel" 
            value={employee.email || '—'} 
          />
          
          <InfoItem 
            icon={<Phone className="h-5 w-5" />} 
            label="Téléphone" 
            value={employee.phone || '—'} 
          />
          
          <InfoItem 
            icon={<MapPin className="h-5 w-5" />} 
            label="Adresse" 
            value={
              <>
                <div>{employee.streetNumber || ''} {employee.streetName || ''}</div>
                <div>{employee.zipCode || ''} {employee.city || ''}</div>
                <div>{employee.region || ''}</div>
                <div>{employee.country || ''}</div>
              </>
            } 
          />
          
          <InfoItem 
            icon={<Calendar className="h-5 w-5" />} 
            label="Date de naissance" 
            value={formatDate(employee.birthDate)} 
          />
        </div>
      </div>
    </div>
  );
};

export default InformationsTab;
