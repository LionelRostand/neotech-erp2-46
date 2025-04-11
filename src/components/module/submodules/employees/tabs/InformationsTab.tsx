
import React, { useState, useEffect } from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmployee } from '@/components/module/submodules/employees/services/employeeService';
import { toast } from 'sonner';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressData, setAddressData] = useState<EmployeeAddress>(() => {
    // Initialiser avec les données d'adresse existantes
    if (typeof employee.address === 'object') {
      return employee.address as EmployeeAddress;
    } else {
      // Tenter de parser l'adresse si c'est une chaîne
      return {
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
        streetNumber: '',
        department: '',
      };
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employee);

  // Mettre à jour l'état local lorsque l'employé change
  useEffect(() => {
    setCurrentEmployee(employee);
    
    // Mise à jour de l'état de l'adresse lorsque l'employé change
    if (typeof employee.address === 'object') {
      setAddressData(employee.address as EmployeeAddress);
    }
  }, [employee]);

  // Fonction pour formater une adresse
  const formatAddress = (address: EmployeeAddress | string): string => {
    if (typeof address === 'string') {
      return address;
    }
    
    const { streetNumber, street, city, postalCode, department, country } = address;
    const parts = [
      streetNumber && street ? `${streetNumber} ${street}` : (street || ''),
      city || '',
      postalCode || '',
      department ? `(${department})` : '',
      country || ''
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const handleSaveAddress = async () => {
    setIsSubmitting(true);
    try {
      // Vérifier que toutes les valeurs requises sont définies
      const cleanedAddress: EmployeeAddress = {
        street: addressData.street || '',
        city: addressData.city || '',
        postalCode: addressData.postalCode || '',
        country: addressData.country || 'France',
        // Ne pas inclure les valeurs undefined
        ...(addressData.streetNumber ? { streetNumber: addressData.streetNumber } : {}),
        ...(addressData.department ? { department: addressData.department } : {}),
        ...(addressData.state ? { state: addressData.state } : {})
      };

      // Mettre à jour l'adresse dans Firebase
      await updateEmployee(employee.id, { address: cleanedAddress });
      
      // Mettre à jour l'employé local pour refléter le changement immédiatement
      setCurrentEmployee({
        ...currentEmployee,
        address: cleanedAddress
      });
      
      toast.success("Adresse mise à jour avec succès");
      setIsAddressDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse:", error);
      toast.error("Erreur lors de la mise à jour de l'adresse");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Nom complet</h4>
          <p>{currentEmployee.firstName} {currentEmployee.lastName}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Email</h4>
          <p>{currentEmployee.email}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Téléphone</h4>
          <p>{currentEmployee.phone || 'Non renseigné'}</p>
        </div>
        <Separator />
        <div className="space-y-1 flex justify-between items-start">
          <div>
            <h4 className="text-sm font-semibold">Adresse</h4>
            <p>{formatAddress(currentEmployee.address)}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddressDialogOpen(true)}
          >
            Modifier
          </Button>
        </div>
      </CardContent>

      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'adresse</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="streetNumber" className="text-right">N°</Label>
              <Input
                id="streetNumber"
                value={addressData.streetNumber || ''}
                onChange={(e) => setAddressData({ ...addressData, streetNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">Rue</Label>
              <Input
                id="street"
                value={addressData.street || ''}
                onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">Ville</Label>
              <Input
                id="city"
                value={addressData.city || ''}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postalCode" className="text-right">Code Postal</Label>
              <Input
                id="postalCode"
                value={addressData.postalCode || ''}
                onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Département</Label>
              <Input
                id="department"
                value={addressData.department || ''}
                onChange={(e) => setAddressData({ ...addressData, department: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">Pays</Label>
              <Input
                id="country"
                value={addressData.country || 'France'}
                onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={handleSaveAddress} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InformationsTab;
