
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Non spécifié</Badge>;
    
    switch(status.toLowerCase()) {
      case 'active':
      case 'actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'inactive':
      case 'inactif':
        return <Badge variant="outline">Inactif</Badge>;
      case 'onleave':
      case 'en congé':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En congé</Badge>;
      case 'suspended':
      case 'suspendu':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Prénom</div>
                <div className="font-medium">{employee.firstName || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Nom</div>
                <div className="font-medium">{employee.lastName || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{employee.email || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Téléphone</div>
                <div className="font-medium">{employee.phone || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Date de naissance</div>
                <div className="font-medium">{formatDate(employee.birthDate)}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Statut</div>
                <div className="font-medium">{getStatusBadge(employee.status)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Poste</div>
                <div className="font-medium">{employee.position || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Département</div>
                <div className="font-medium">{employee.departmentName || employee.department || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Email professionnel</div>
                <div className="font-medium">{employee.professionalEmail || employee.email || 'Non spécifié'}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Date d'embauche</div>
                <div className="font-medium">{formatDate(employee.hireDate || employee.startDate)}</div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Entreprise</div>
                <div className="font-medium">
                  {typeof employee.company === 'object' ? 
                    employee.company?.name || 'Non spécifiée' : 
                    employee.company || 'Non spécifiée'}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Responsable</div>
                <div className="font-medium">{employee.managerName || 'Non spécifié'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {employee.address && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Adresse</h3>
            <div className="space-y-2">
              <div>
                {employee.address.street && <div>{employee.address.street}</div>}
                {employee.address.postalCode && employee.address.city && (
                  <div>{employee.address.postalCode} {employee.address.city}</div>
                )}
                {employee.address.country && <div>{employee.address.country}</div>}
                {(!employee.address.street && !employee.address.city && !employee.address.postalCode && !employee.address.country) && (
                  <div>Adresse non spécifiée</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InformationsTab;
