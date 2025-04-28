
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from '@/types/employee';

interface InformationsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const InformationsTabEdit: React.FC<InformationsTabEditProps> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    email: employee.email || "",
    professionalEmail: employee.professionalEmail || "",
    phone: employee.phone || "",
    position: employee.position || "",
    department: employee.department || "",
    status: employee.status || "active",
    // Adresse personnelle
    streetNumber: employee.streetNumber || "",
    streetName: employee.streetName || "",
    city: employee.city || "",
    zipCode: employee.zipCode || employee.postalCode || "",
    region: employee.region || "",
    country: employee.country || "France",
    // Adresse professionnelle
    workStreet: employee.workAddress?.street || "",
    workCity: employee.workAddress?.city || "",
    workPostalCode: employee.workAddress?.postalCode || "",
    workCountry: employee.workAddress?.country || "France",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Préparer les données pour la sauvegarde
    const updatedData: Partial<Employee> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      professionalEmail: formData.professionalEmail,
      phone: formData.phone,
      position: formData.position,
      department: formData.department,
      status: formData.status as Employee['status'],
      // Adresse personnelle
      streetNumber: formData.streetNumber,
      streetName: formData.streetName,
      city: formData.city,
      zipCode: formData.zipCode,
      region: formData.region,
      country: formData.country,
      // Créer/mettre à jour l'adresse professionnelle sous forme d'objet
      workAddress: {
        street: formData.workStreet,
        city: formData.workCity,
        postalCode: formData.workPostalCode,
        country: formData.workCountry
      }
    };
    
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input 
                id="firstName" 
                name="firstName"
                value={formData.firstName} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input 
                id="lastName" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email personnel</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalEmail">Email professionnel</Label>
              <Input 
                id="professionalEmail" 
                name="professionalEmail"
                type="email"
                value={formData.professionalEmail} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                name="phone"
                value={formData.phone} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input 
                id="position" 
                name="position"
                value={formData.position} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input 
                id="department" 
                name="department"
                value={formData.department} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="onLeave">En congé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Adresse personnelle</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetNumber">Numéro</Label>
                  <Input 
                    id="streetNumber" 
                    name="streetNumber"
                    value={formData.streetNumber} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="streetName">Rue</Label>
                  <Input 
                    id="streetName" 
                    name="streetName"
                    value={formData.streetName} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    name="city"
                    value={formData.city} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Code postal</Label>
                  <Input 
                    id="zipCode" 
                    name="zipCode"
                    value={formData.zipCode} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Input 
                    id="region" 
                    name="region"
                    value={formData.region} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input 
                    id="country" 
                    name="country"
                    value={formData.country} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Adresse professionnelle</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workStreet">Adresse</Label>
                <Input 
                  id="workStreet" 
                  name="workStreet"
                  value={formData.workStreet} 
                  onChange={handleInputChange} 
                  placeholder="Rue et numéro"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workCity">Ville</Label>
                  <Input 
                    id="workCity" 
                    name="workCity"
                    value={formData.workCity} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workPostalCode">Code postal</Label>
                  <Input 
                    id="workPostalCode" 
                    name="workPostalCode"
                    value={formData.workPostalCode} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workCountry">Pays</Label>
                <Input 
                  id="workCountry" 
                  name="workCountry"
                  value={formData.workCountry} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};

export default InformationsTabEdit;
