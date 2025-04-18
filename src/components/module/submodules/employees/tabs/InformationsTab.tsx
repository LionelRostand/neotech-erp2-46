
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle, 
} from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin,
  Building2,
  CalendarDays,
  Edit,
  Save,
  X,
  User
} from 'lucide-react';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onEmployeeUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || '',
    region: employee.region || '',
    phone: employee.phone || '',
    email: employee.email || '',
    birthDate: employee.birthDate || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Preserve existing photo and photoMeta data
      const updateData = {
        ...formData,
        // Explicitly include these to ensure they're preserved
        photo: employee.photo,
        photoURL: employee.photoURL,
        photoData: employee.photoData,
        photoMeta: employee.photoMeta,
        updatedAt: new Date().toISOString()
      };
      
      const updatedEmployee = await updateDocument(
        COLLECTIONS.HR.EMPLOYEES, 
        employee.id, 
        updateData
      );
      
      toast.success('Informations mises à jour avec succès');
      setIsEditing(false);
      
      if (onEmployeeUpdated && updatedEmployee) {
        onEmployeeUpdated({
          ...employee,
          ...updateData
        } as Employee);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error('Erreur lors de la mise à jour des informations');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      streetNumber: employee.streetNumber || '',
      streetName: employee.streetName || '',
      city: employee.city || '',
      zipCode: employee.zipCode || '',
      region: employee.region || '',
      phone: employee.phone || '',
      email: employee.email || '',
      birthDate: employee.birthDate || ''
    });
    setIsEditing(false);
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Coordonnées et informations de l'employé</CardDescription>
          </div>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Nom complet</p>
                    <p className="text-sm text-muted-foreground">{employee.firstName} {employee.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Téléphone</p>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Numéro de téléphone"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{employee.phone || 'Non spécifié'}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email personnel</p>
                    {isEditing ? (
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Adresse email"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{employee.email || 'Non spécifié'}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Date de naissance</p>
                    {isEditing ? (
                      <Input
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {employee.birthDate || 'Non spécifiée'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                    Adresse
                  </p>
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-1">
                          <Input
                            name="streetNumber"
                            value={formData.streetNumber}
                            onChange={handleChange}
                            placeholder="N°"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            name="streetName"
                            value={formData.streetName}
                            onChange={handleChange}
                            placeholder="Nom de rue"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="Code postal"
                        />
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Ville"
                        />
                      </div>
                      
                      <Input
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        placeholder="Région"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {employee.streetNumber || employee.streetName ? (
                        <p>{employee.streetNumber} {employee.streetName}</p>
                      ) : null}
                      
                      {employee.zipCode || employee.city ? (
                        <p>{employee.zipCode} {employee.city}</p>
                      ) : null}
                      
                      {employee.region ? (
                        <p>{employee.region}</p>
                      ) : null}
                      
                      {!employee.streetNumber && !employee.streetName && !employee.zipCode && !employee.city && !employee.region && (
                        <p>Aucune adresse enregistrée</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Entreprise et position</CardTitle>
          <CardDescription>Informations professionnelles de l'employé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Entreprise</p>
                  <p className="text-sm text-muted-foreground">{employee.company || 'Non spécifiée'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Poste</p>
                  <p className="text-sm text-muted-foreground">{employee.position || 'Non spécifié'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Département</p>
                  <p className="text-sm text-muted-foreground">{employee.department || 'Non spécifié'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email professionnel</p>
                  <p className="text-sm text-muted-foreground">{employee.professionalEmail || 'Non spécifié'}</p>
                </div>
              </div>
              
              {employee.isManager && (
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Statut de manager</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Manager
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
