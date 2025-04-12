
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

interface EditDepartmentDialogProps {
  formData: DepartmentFormData;
  selectedEmployees: string[];
  activeTab: number;
  onTabChange: (tab: number) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManagerChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onEmployeeSelection: (employeeIds: string[]) => void;
  onClose: () => void;
  onUpdate: () => void;
}

const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({
  formData,
  selectedEmployees,
  activeTab,
  onTabChange,
  onInputChange,
  onManagerChange,
  onColorChange,
  onEmployeeSelection,
  onClose,
  onUpdate,
}) => {
  // Utiliser les données des employés depuis Firebase
  const { employees, isLoading } = useEmployeeData();

  // Handle single employee selection and update the array
  const handleSingleEmployeeSelection = (employeeId: string) => {
    const updatedSelection = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];
    
    onEmployeeSelection(updatedSelection);
  };

  // Convert numeric tab index to string for Tabs component
  const tabValue = activeTab === 0 ? "department-info" : "department-employees";
  
  // Convert string tab value back to numeric index
  const handleTabChange = (value: string) => {
    onTabChange(value === "department-info" ? 0 : 1);
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Modifier le département</DialogTitle>
      </DialogHeader>
      
      <Tabs value={tabValue} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="department-info">
            Informations
          </TabsTrigger>
          <TabsTrigger value="department-employees">
            Employés
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="department-info" className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-id" className="text-right">
              ID
            </Label>
            <Input
              id="edit-id"
              value={formData.id}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Nom
            </Label>
            <Input
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Input
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-manager" className="text-right">
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
            <Label htmlFor="edit-color" className="text-right">
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
        
        <TabsContent value="department-employees" className="py-4">
          <EmployeesList 
            employees={employees || []}
            selectedEmployees={selectedEmployees}
            onEmployeeSelection={handleSingleEmployeeSelection}
            id="edit"
          />
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onUpdate}>Mettre à jour</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditDepartmentDialog;
