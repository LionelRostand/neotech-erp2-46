
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  IdCard 
} from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const formatAddress = () => {
    if (typeof employee.address === 'string') {
      return employee.address;
    }
    
    if (employee.address) {
      return `${employee.address.street}, ${employee.address.city} ${employee.address.postalCode}`;
    }
    
    return 'Adresse non renseignée';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Date de naissance : {employee.birthDate || 'Non renseignée'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email personnel : {employee.email || 'Email non renseigné'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>Téléphone : {employee.phone || 'Téléphone non renseigné'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{formatAddress()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Poste : {employee.position || 'Non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email professionnel : {employee.professionalEmail || 'Non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Département : {employee.department || 'Non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Date d'embauche : {employee.hireDate || 'Non renseignée'}</span>
            </div>
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <span>Type de contrat : {employee.contract || 'Non spécifié'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
