
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DepartmentFormData } from './types';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import EmployeesList from './EmployeesList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import ColorSelector from './components/ColorSelector';

interface AddDepartmentDialogProps {
  formData: DepartmentFormData;
  selectedEmployees: string[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onManagerChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onEmployeeSelection: (employeeId: string, isSelected: boolean) => void;
  onClose: () => void;
  onSave: (formData: DepartmentFormData, selectedEmployeeIds: string[]) => Promise<boolean>;
}

const AddDepartmentDialog: React.FC<AddDepartmentDialogProps> = ({
  formData,
  selectedEmployees,
  activeTab,
  onTabChange,
  onInputChange,
  onManagerChange,
  onCompanyChange,
  onColorChange,
  onEmployeeSelection,
  onClose,
  onSave
}) => {
  const { companies, isLoading: companiesLoading } = useCompaniesData();
  const { employees, isLoading: employeesLoading } = useEmployeeData();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const success = await onSave(formData, selectedEmployees);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedEmployees = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return [];
    
    return [...employees].sort((a, b) => {
      const nameA = `${a?.lastName || ''} ${a?.firstName || ''}`.toLowerCase();
      const nameB = `${b?.lastName || ''} ${b?.firstName || ''}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [employees]);

  return (
    <DialogContent className="sm:max-w-[550px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Nouveau département</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau département pour organiser vos employés.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={onTabChange} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="employés">Employés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations" className="space-y-4 mt-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  disabled
                  value="Généré automatiquement"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">
                  Responsable
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.managerId || "none"}
                    onValueChange={onManagerChange}
                    disabled={employeesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un responsable" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="none">Aucun responsable</SelectItem>
                      {sortedEmployees.map((employee: Employee) => (
                        <SelectItem
                          key={employee?.id || `emp-${Math.random()}`}
                          value={employee?.id || ""}
                        >
                          {`${employee?.lastName || ""} ${employee?.firstName || ""}`.trim() || "Employé sans nom"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Entreprise
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.companyId || "none"}
                    onValueChange={onCompanyChange}
                    disabled={companiesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une entreprise" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="none">Aucune entreprise</SelectItem>
                      {(companies || []).map((company: any) => (
                        <SelectItem
                          key={company?.id || `company-${Math.random()}`}
                          value={company?.id || ""}
                        >
                          {company?.name || "Entreprise sans nom"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Couleur
                </Label>
                <div className="col-span-3">
                  <ColorSelector
                    value={formData.color}
                    onChange={onColorChange}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employés" className="mt-4">
            <EmployeesList
              employees={sortedEmployees || []}
              selectedEmployees={selectedEmployees}
              onEmployeeSelection={onEmployeeSelection}
              isLoading={employeesLoading}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.name}>
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddDepartmentDialog;
