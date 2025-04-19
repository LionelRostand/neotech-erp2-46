import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createEmployeeWithAccount } from '@/services/userService';
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  IdCard,
  Save,
  X,
  SendHorizontal
} from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onEmployeeUpdated 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);
  const [isSending, setIsSending] = useState(false);

  const formatAddress = () => {
    if (typeof employee.address === 'string') {
      return employee.address;
    }
    
    if (employee.address) {
      return `${employee.address.street}, ${employee.address.city} ${employee.address.postalCode}`;
    }
    
    return 'Adresse non renseignée';
  };

  const handleInputChange = (field: keyof Employee, value: string) => {
    setEditedEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onEmployeeUpdated) {
      onEmployeeUpdated(editedEmployee);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  const handleSendCredentials = async () => {
    if (!editedEmployee.email || !editedEmployee.professionalEmail) {
      toast.error("L'email personnel et professionnel sont requis");
      return;
    }

    setIsSending(true);
    try {
      const result = await createEmployeeWithAccount(editedEmployee, editedEmployee.professionalEmail);
      
      if (result.success) {
        toast.success("Credentials envoyés avec succès");
        if (result.employee && onEmployeeUpdated) {
          onEmployeeUpdated(result.employee);
        }
      } else {
        toast.error("Erreur lors de l'envoi des credentials");
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'envoi des credentials");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4 gap-2">
        {!isEditing ? (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
            <Button 
              variant="outline"
              onClick={handleSendCredentials}
              disabled={isSending || !employee.email || !employee.professionalEmail}
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              Envoyer les credentials
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedEmployee.birthDate || ''}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="max-w-[200px]"
                  />
                ) : (
                  <span>Date de naissance : {employee.birthDate || 'Non renseignée'}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedEmployee.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email personnel"
                  />
                ) : (
                  <span>Email personnel : {employee.email || 'Email non renseigné'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedEmployee.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Téléphone"
                  />
                ) : (
                  <span>Téléphone : {employee.phone || 'Téléphone non renseigné'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={typeof editedEmployee.address === 'string' ? editedEmployee.address : formatAddress()}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Adresse"
                  />
                ) : (
                  <span>{formatAddress()}</span>
                )}
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
                {isEditing ? (
                  <Input
                    value={editedEmployee.position || ''}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Poste"
                  />
                ) : (
                  <span>Poste : {employee.position || 'Non spécifié'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedEmployee.professionalEmail || ''}
                    onChange={(e) => handleInputChange('professionalEmail', e.target.value)}
                    placeholder="Email professionnel"
                  />
                ) : (
                  <span>Email professionnel : {employee.professionalEmail || 'Non spécifié'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editedEmployee.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Département"
                  />
                ) : (
                  <span>Département : {employee.department || 'Non spécifié'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedEmployee.hireDate || ''}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    className="max-w-[200px]"
                  />
                ) : (
                  <span>Date d'embauche : {employee.hireDate || 'Non renseignée'}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editedEmployee.contract || ''}
                    onChange={(e) => handleInputChange('contract', e.target.value)}
                    placeholder="Type de contrat"
                  />
                ) : (
                  <span>Type de contrat : {employee.contract || 'Non spécifié'}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InformationsTab;
