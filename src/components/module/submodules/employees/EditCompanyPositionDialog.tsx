
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { updateEmployee } from '@/hooks/firebase/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

interface EditCompanyPositionDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

export const EditCompanyPositionDialog: React.FC<EditCompanyPositionDialogProps> = ({
  employee,
  open,
  onOpenChange,
  onEmployeeUpdated
}) => {
  const { companies, isLoading } = useCompaniesData();
  const [position, setPosition] = useState(employee.position || '');
  const [department, setDepartment] = useState(employee.department || '');
  const [companyId, setCompanyId] = useState<string>(
    typeof employee.company === 'string' ? employee.company : employee.company?.id || ''
  );
  const [professionalEmail, setProfessionalEmail] = useState(employee.professionalEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Préparer les données à mettre à jour
      const updatedData: Partial<Employee> = {
        position,
        department,
        professionalEmail
      };

      // Si l'entreprise a changé, mettre à jour l'entreprise
      if (companyId) {
        // Trouver l'objet entreprise complet
        const selectedCompany = companies.find(company => company.id === companyId);
        
        if (selectedCompany) {
          updatedData.company = selectedCompany;
        } else {
          updatedData.company = companyId;
        }
      }

      // Mettre à jour l'employé dans Firestore
      if (employee.id) {
        const success = await updateEmployee(COLLECTIONS.HR.EMPLOYEES, employee.id, updatedData);
        
        if (success) {
          toast.success("Informations professionnelles mises à jour avec succès");
          
          // Mettre à jour l'employé dans l'interface
          if (onEmployeeUpdated) {
            onEmployeeUpdated({
              ...employee,
              ...updatedData
            });
          }
          
          onOpenChange(false);
        } else {
          toast.error("Erreur lors de la mise à jour des informations");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour des informations");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations professionnelles</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Select
                value={companyId}
                onValueChange={setCompanyId}
                disabled={isLoading}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Poste de l'employé"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Département"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="professionalEmail">Email professionnel</Label>
              <Input
                id="professionalEmail"
                type="email"
                value={professionalEmail}
                onChange={(e) => setProfessionalEmail(e.target.value)}
                placeholder="Email professionnel"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
