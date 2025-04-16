
import React from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { departmentColors } from './types';
import EmployeesList from './EmployeesList';

interface EditDepartmentDialogProps {
  formData: any;
  selectedEmployees: string[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onManagerChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onEmployeeSelection: (employeeId: string, selected: boolean) => void;
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
  onUpdate
}) => {
  const { employees } = useEmployeeData();
  const { companies, isLoading: companiesLoading } = useFirebaseCompanies();

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Modifier le département</DialogTitle>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du département</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={onInputChange} 
                placeholder="Ex: Resources Humaines"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={onInputChange} 
                placeholder="Description du département"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select 
                value={formData.managerId || "none"} 
                onValueChange={onManagerChange}
              >
                <SelectTrigger id="manager">
                  <SelectValue placeholder="Sélectionner un manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {employees.map(employee => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                    >
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Select 
                value={formData.companyId || ""} 
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: "companyId",
                      value
                    }
                  } as React.ChangeEvent<HTMLInputElement>;
                  onInputChange(event);
                }}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {!companiesLoading && companies?.map(company => (
                    <SelectItem 
                      key={company.id} 
                      value={company.id}
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Select 
                value={formData.color} 
                onValueChange={onColorChange}
              >
                <SelectTrigger 
                  id="color" 
                  className="flex items-center"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {departmentColors.map(color => (
                    <SelectItem 
                      key={color.value} 
                      value={color.value}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <EmployeesList 
            employees={employees}
            selectedEmployees={selectedEmployees}
            onEmployeeSelection={onEmployeeSelection}
          />
        </TabsContent>
      </Tabs>

      <DialogFooter className="mt-6 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {selectedEmployees.length} employé(s) sélectionné(s)
        </div>
        <div>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Annuler
          </Button>
          <Button onClick={onUpdate}>
            Enregistrer
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditDepartmentDialog;
