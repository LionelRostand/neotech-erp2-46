
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateEmployeeDoc } from '@/services/employeeService';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/formatters';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onEmployeeUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(employee.email || '');
  const [phone, setPhone] = useState(employee.phone || '');
  const [professionalEmail, setProfessionalEmail] = useState(employee.professionalEmail || '');
  
  // Address fields
  const [street, setStreet] = useState(
    typeof employee.address === 'object' ? employee.address?.street : ''
  );
  const [city, setCity] = useState(
    typeof employee.address === 'object' ? employee.address?.city : ''
  );
  const [postalCode, setPostalCode] = useState(
    typeof employee.address === 'object' ? employee.address?.postalCode : ''
  );
  const [addressString, setAddressString] = useState(
    typeof employee.address === 'string' ? employee.address : employee.address_string || ''
  );
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    // Reset to original values
    setEmail(employee.email || '');
    setPhone(employee.phone || '');
    setProfessionalEmail(employee.professionalEmail || '');
    
    setStreet(typeof employee.address === 'object' ? employee.address?.street : '');
    setCity(typeof employee.address === 'object' ? employee.address?.city : '');
    setPostalCode(typeof employee.address === 'object' ? employee.address?.postalCode : '');
    setAddressString(typeof employee.address === 'string' ? employee.address : employee.address_string || '');
    
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    try {
      // Prepare update data, avoiding undefined values
      const updateData: Partial<Employee> = {
        email,
        phone,
        professionalEmail,
      };
      
      // Only update address as an object if we have street data
      if (street) {
        updateData.address = {
          street: street || "",
          city: city || "",
          postalCode: postalCode || "",
          // Don't include country if not present to avoid undefined value
        };
      } else if (addressString) {
        // If no structured address but we have a string address
        updateData.address_string = addressString;
      }
      
      // If we're updating address in object form, make sure to also update individual fields
      if (typeof updateData.address === 'object') {
        updateData.streetName = street;
        updateData.city = city;
        updateData.zipCode = postalCode;
      }
      
      console.log('Updating employee with ID:', employee.id, 'Data:', updateData);
      
      // Mettre à jour l'employé dans la base de données
      const updatedEmployee = await updateEmployeeDoc(employee.id, updateData);
      
      if (updatedEmployee) {
        toast.success('Informations mises à jour avec succès');
        
        // Si un callback de mise à jour a été fourni, l'appeler avec l'employé mis à jour
        if (typeof onEmployeeUpdated === 'function') {
          onEmployeeUpdated(updatedEmployee);
        }
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      toast.error('Erreur lors de la mise à jour des informations: ' + error);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Informations personnelles</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Informations de contact</h4>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email personnel</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="professionalEmail">Email professionnel</Label>
                    <Input
                      id="professionalEmail"
                      value={professionalEmail}
                      onChange={(e) => setProfessionalEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Email personnel:</span> {employee.email || '-'}</p>
                  <p className="text-sm"><span className="font-medium">Email professionnel:</span> {employee.professionalEmail || '-'}</p>
                  <p className="text-sm"><span className="font-medium">Téléphone:</span> {employee.phone || '-'}</p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Adresse</h4>
              {isEditing ? (
                <div className="space-y-4">
                  {typeof employee.address === 'object' ? (
                    <>
                      <div>
                        <Label htmlFor="street">Rue</Label>
                        <Input
                          id="street"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label htmlFor="address">Adresse complète</Label>
                      <Input
                        id="address"
                        value={addressString}
                        onChange={(e) => setAddressString(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm">
                  {typeof employee.address === 'object' ? (
                    <>
                      <p>{employee.address?.street || ''}</p>
                      <p>{employee.address?.postalCode || ''} {employee.address?.city || ''}</p>
                      <p>{employee.address?.country || ''}</p>
                    </>
                  ) : (
                    <p>{employee.address || employee.address_string || '-'}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Informations professionnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm"><span className="font-medium">Poste:</span> {employee.position || '-'}</p>
                <p className="text-sm"><span className="font-medium">Département:</span> {employee.department || '-'}</p>
                <p className="text-sm"><span className="font-medium">Contrat:</span> {employee.contract || '-'}</p>
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">Date d'embauche:</span> {employee.hireDate ? formatDate(new Date(employee.hireDate)) : '-'}</p>
                <p className="text-sm"><span className="font-medium">Manager:</span> {employee.manager || '-'}</p>
                <p className="text-sm"><span className="font-medium">Statut:</span> 
                  <Badge variant={employee.status === 'active' || employee.status === 'Actif' ? 'success' : 'secondary'} className="ml-2">
                    {employee.status || '-'}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
