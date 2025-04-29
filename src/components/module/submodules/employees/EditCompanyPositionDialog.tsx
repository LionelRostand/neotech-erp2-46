
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

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
  const { companies, isLoading: isLoadingCompanies } = useCompaniesData();
  const { departments, isLoading: isLoadingDepartments } = useAvailableDepartments();
  const [position, setPosition] = useState(employee.position || '');
  const [departmentId, setDepartmentId] = useState(employee.departmentId || '');
  const [companyId, setCompanyId] = useState<string>(
    typeof employee.company === 'string' ? employee.company : employee.company?.id || ''
  );
  const [professionalEmail, setProfessionalEmail] = useState(employee.professionalEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      setPosition(employee.position || '');
      setDepartmentId(employee.departmentId || '');
      setProfessionalEmail(employee.professionalEmail || '');
      setCompanyId(typeof employee.company === 'string' ? employee.company : employee.company?.id || '');
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get department name from selected departmentId
      const selectedDepartment = departments.find(dept => dept.id === departmentId);
      
      // Prepare data to update
      const updatedData: Partial<Employee> = {
        position,
        departmentId,
        department: selectedDepartment?.name || employee.department || '',
        professionalEmail
      };

      // If company has changed, update company
      if (companyId) {
        // Find complete company object
        const selectedCompany = companies.find(company => company.id === companyId);
        
        if (selectedCompany) {
          updatedData.company = selectedCompany;
        } else {
          updatedData.company = companyId;
        }
      }

      // Update employee in Firestore
      if (employee.id) {
        const result = await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, updatedData);
        
        if (result) {
          toast.success("Informations professionnelles mises à jour avec succès");
          
          // Update employee in the interface
          if (onEmployeeUpdated) {
            const updatedEmployee = {
              ...employee,
              ...updatedData
            };
            onEmployeeUpdated(updatedEmployee);
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
                disabled={isLoadingCompanies}
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
              <Select
                value={departmentId}
                onValueChange={setDepartmentId}
                disabled={isLoadingDepartments}
              >
                <SelectTrigger id="department" className="bg-popover">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="">Aucun département</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
