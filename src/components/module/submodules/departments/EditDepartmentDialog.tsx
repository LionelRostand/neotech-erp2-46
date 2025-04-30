
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { DepartmentFormData, departmentColors } from './types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmployeesList from './EmployeesList';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

interface EditDepartmentDialogProps {
  formData: DepartmentFormData;
  selectedEmployees: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onManagerChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onEmployeeSelection: (employeeId: string, checked: boolean) => void;
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
  onCompanyChange,
  onColorChange,
  onEmployeeSelection,
  onClose,
  onUpdate,
}) => {
  const { employees } = useEmployeeData();
  const { companies } = useFirebaseCompanies();

  // Find the selected manager for display
  const selectedManager = employees?.find(emp => emp.id === formData.managerId);
  const managerName = selectedManager 
    ? `${selectedManager.firstName} ${selectedManager.lastName}`
    : 'Aucun responsable';

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Modifier le département</DialogTitle>
      </DialogHeader>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Informations</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
        </TabsList>
        
        <div className="py-4">
          <TabsContent value="general">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du département</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  rows={3}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <Label htmlFor="manager">Responsable</Label>
                <Select 
                  value={formData.managerId || "none"} 
                  onValueChange={onManagerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un responsable">
                      {managerName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun responsable</SelectItem>
                    {employees && employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Select 
                  value={formData.companyId || "none"} 
                  onValueChange={onCompanyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune entreprise</SelectItem>
                    {companies && companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Couleur</Label>
                <RadioGroup 
                  value={formData.color} 
                  onValueChange={onColorChange}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {departmentColors.map((color) => (
                    <div key={color.value} className="flex items-center gap-2">
                      <RadioGroupItem 
                        id={`color-${color.value}`} 
                        value={color.value}
                        className="sr-only" 
                      />
                      <Label 
                        htmlFor={`color-${color.value}`}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${
                          formData.color === color.value ? 'border-black scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value }}
                      ></Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="employees">
            <div className="space-y-4">
              <Label>Assigner des employés</Label>
              <EmployeesList 
                employees={employees || []}
                selectedEmployees={selectedEmployees}
                onEmployeeSelection={onEmployeeSelection}
                id="edit"
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={onUpdate}>Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditDepartmentDialog;
