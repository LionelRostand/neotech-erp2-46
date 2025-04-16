
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DepartmentFormData, departmentColors } from './types';
import EmployeesList from './EmployeesList';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

interface AddDepartmentDialogProps {
  formData: DepartmentFormData;
  selectedEmployees: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManagerChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onEmployeeSelection: (employeeId: string, checked: boolean) => void;
  onClose: () => void;
  onSave: () => void;
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
  onSave,
}) => {
  // Utiliser les données des employés depuis Firebase
  const { employees, isLoading } = useEmployeeData();
  // Utiliser les données des entreprises depuis Firebase
  const { companies, isLoading: isLoadingCompanies } = useFirebaseCompanies();

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Nouveau département</DialogTitle>
      </DialogHeader>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">
            Informations
          </TabsTrigger>
          <TabsTrigger value="employees">
            Employés
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              ID
            </Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              className="col-span-3"
              disabled
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
            <Input
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
              <Select value={formData.managerId || "none"} onValueChange={onManagerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un responsable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun responsable</SelectItem>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : (
                    employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Entreprise
            </Label>
            <div className="col-span-3">
              <Select value={formData.companyId || "none"} onValueChange={onCompanyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune entreprise</SelectItem>
                  {isLoadingCompanies ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : (
                    companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Couleur
            </Label>
            <div className="col-span-3">
              <Select value={formData.color || departmentColors[0].value} onValueChange={onColorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une couleur" />
                </SelectTrigger>
                <SelectContent>
                  {departmentColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="employees" className="py-4">
          <EmployeesList 
            employees={employees || []}
            selectedEmployees={selectedEmployees}
            onEmployeeSelection={onEmployeeSelection}
            id="add"
          />
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onSave}>Créer</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddDepartmentDialog;
