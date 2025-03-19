
import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, User, UserPlus, UserMinus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Define department interface
interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  managerName: string | null;
  employeesCount: number;
  color: string;
  employeeIds: string[];
}

const EmployeesDepartments: React.FC = () => {
  // Hook to Firestore departments collection
  const departmentsFirestore = useFirestore(COLLECTIONS.EMPLOYEES + '_departments');
  
  // Initial departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "DEP001",
      name: "Marketing",
      description: "Responsable de la stratégie marketing et de la communication",
      managerId: "EMP003",
      managerName: "Sophie Martin",
      employeesCount: 2,
      color: "#3b82f6", // blue-500
      employeeIds: ["EMP003", "EMP004"]
    },
    {
      id: "DEP002",
      name: "Direction",
      description: "Direction générale de l'entreprise",
      managerId: "EMP002",
      managerName: "Lionel Djossa",
      employeesCount: 1,
      color: "#10b981", // emerald-500
      employeeIds: ["EMP002"]
    }
  ]);

  // State for dialog control and form data
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    managerId: "",
    color: "#3b82f6",
    employeeIds: [] as string[]
  });
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState("department-info");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // List of available colors for departments
  const departmentColors = [
    { value: "#3b82f6", label: "Bleu" },
    { value: "#10b981", label: "Vert" },
    { value: "#ef4444", label: "Rouge" },
    { value: "#f59e0b", label: "Orange" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#ec4899", label: "Rose" },
    { value: "#6b7280", label: "Gris" },
    { value: "#111827", label: "Noir" }
  ];

  // Load departments from Firestore on component mount
  useEffect(() => {
    // Uncomment when ready to use Firestore
    // loadDepartmentsFromFirestore();
  }, []);

  // Function to load departments from Firestore
  const loadDepartmentsFromFirestore = async () => {
    try {
      const data = await departmentsFirestore.getAll();
      if (data && data.length > 0) {
        setDepartments(data as Department[]);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Erreur lors du chargement des départements");
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle manager selection
  const handleManagerChange = (value: string) => {
    setFormData({ ...formData, managerId: value });
  };

  // Handle color selection
  const handleColorChange = (value: string) => {
    setFormData({ ...formData, color: value });
  };

  // Open add department dialog
  const handleAddDepartment = () => {
    setFormData({
      id: `DEP${(departments.length + 1).toString().padStart(3, '0')}`,
      name: "",
      description: "",
      managerId: "",
      color: "#3b82f6",
      employeeIds: []
    });
    setSelectedEmployees([]);
    setActiveTab("department-info");
    setIsAddDialogOpen(true);
  };

  // Open edit department dialog
  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description,
      managerId: department.managerId || "",
      color: department.color,
      employeeIds: department.employeeIds || []
    });
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab("department-info");
    setIsEditDialogOpen(true);
  };

  // Open manage employees dialog
  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  };

  // Handle employee selection/deselection
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Save new department
  const handleSaveDepartment = async () => {
    if (!formData.name) {
      toast.error("Le nom du département est requis");
      return;
    }

    const selectedManager = formData.managerId 
      ? employees.find(emp => emp.id === formData.managerId) 
      : null;

    const newDepartment: Department = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      managerId: formData.managerId || null,
      managerName: selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : null,
      employeesCount: selectedEmployees.length,
      color: formData.color,
      employeeIds: selectedEmployees
    };

    try {
      // Uncomment when ready to use Firestore
      // await departmentsFirestore.set(newDepartment.id, newDepartment);
      setDepartments([...departments, newDepartment]);
      setIsAddDialogOpen(false);
      toast.success(`Département ${formData.name} créé avec succès`);
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
    }
  };

  // Update existing department
  const handleUpdateDepartment = async () => {
    if (!formData.name || !currentDepartment) {
      toast.error("Le nom du département est requis");
      return;
    }

    const selectedManager = formData.managerId 
      ? employees.find(emp => emp.id === formData.managerId) 
      : null;

    const updatedDepartment: Department = {
      ...currentDepartment,
      name: formData.name,
      description: formData.description,
      managerId: formData.managerId || null,
      managerName: selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : null,
      employeesCount: selectedEmployees.length,
      color: formData.color,
      employeeIds: selectedEmployees
    };

    try {
      // Uncomment when ready to use Firestore
      // await departmentsFirestore.update(updatedDepartment.id, updatedDepartment);
      
      const updatedDepartments = departments.map(dep => {
        if (dep.id === currentDepartment.id) {
          return updatedDepartment;
        }
        return dep;
      });

      setDepartments(updatedDepartments);
      setIsEditDialogOpen(false);
      toast.success(`Département ${formData.name} mis à jour avec succès`);
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id: string) => {
    const departmentToDelete = departments.find(dep => dep.id === id);
    if (!departmentToDelete) return;

    // Confirm deletion
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${departmentToDelete.name} ?`)) {
      try {
        // Uncomment when ready to use Firestore
        // await departmentsFirestore.remove(id);
        setDepartments(departments.filter(dep => dep.id !== id));
        toast.success(`Département ${departmentToDelete.name} supprimé avec succès`);
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Erreur lors de la suppression du département");
      }
    }
  };

  // Save employee assignments
  const handleSaveEmployeeAssignments = async () => {
    if (!currentDepartment) return;

    try {
      const updatedDepartment = {
        ...currentDepartment,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length
      };

      // Uncomment when ready to use Firestore
      // await departmentsFirestore.update(updatedDepartment.id, updatedDepartment);

      const updatedDepartments = departments.map(dep => {
        if (dep.id === currentDepartment.id) {
          return updatedDepartment;
        }
        return dep;
      });

      setDepartments(updatedDepartments);
      setIsManageEmployeesDialogOpen(false);
      toast.success(`Employés du département ${currentDepartment.name} mis à jour avec succès`);
    } catch (error) {
      console.error("Error updating department employees:", error);
      toast.error("Erreur lors de la mise à jour des employés du département");
    }
  };

  // Get employees list for a department
  const getDepartmentEmployees = (departmentId: string) => {
    const department = departments.find(dep => dep.id === departmentId);
    if (!department || !department.employeeIds) return [];
    
    return employees.filter(emp => department.employeeIds.includes(emp.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Départements</h2>
        <Button onClick={handleAddDepartment}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau département
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des départements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Employés</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: department.color }}
                      ></div>
                      <span>{department.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    {department.managerName ? (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{department.managerName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Non assigné</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{department.employeesCount || 0}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleManageEmployees(department)}
                        className="h-8 px-2"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Gérer
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditDepartment(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau département</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">
                  Responsable
                </Label>
                <div className="col-span-3">
                  <Select value={formData.managerId} onValueChange={handleManagerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun responsable</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
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
                  <Select value={formData.color} onValueChange={handleColorChange}>
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
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Sélectionnez les employés à assigner à ce département:</h3>
                <div className="border rounded-md">
                  <ScrollArea className="h-[250px] w-full">
                    <div className="p-4 space-y-3">
                      {employees.map(employee => (
                        <div key={employee.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`employee-${employee.id}`}
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={() => handleEmployeeSelection(employee.id)}
                          />
                          <label 
                            htmlFor={`employee-${employee.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {employee.firstName} {employee.lastName} - {employee.position}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedEmployees.length} employé(s) sélectionné(s)
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveDepartment}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le département</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-manager" className="text-right">
                  Responsable
                </Label>
                <div className="col-span-3">
                  <Select value={formData.managerId} onValueChange={handleManagerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun responsable</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-color" className="text-right">
                  Couleur
                </Label>
                <div className="col-span-3">
                  <Select value={formData.color} onValueChange={handleColorChange}>
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
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Sélectionnez les employés à assigner à ce département:</h3>
                <div className="border rounded-md">
                  <ScrollArea className="h-[250px] w-full">
                    <div className="p-4 space-y-3">
                      {employees.map(employee => (
                        <div key={employee.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`edit-employee-${employee.id}`}
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={() => handleEmployeeSelection(employee.id)}
                          />
                          <label 
                            htmlFor={`edit-employee-${employee.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {employee.firstName} {employee.lastName} - {employee.position}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedEmployees.length} employé(s) sélectionné(s)
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateDepartment}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Employees Dialog */}
      <Dialog open={isManageEmployeesDialogOpen} onOpenChange={setIsManageEmployeesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentDepartment && (
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: currentDepartment.color }}
                  ></div>
                  <span>Gérer les employés - {currentDepartment.name}</span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Sélectionnez les employés à assigner à ce département:</h3>
              <div className="border rounded-md">
                <ScrollArea className="h-[250px] w-full">
                  <div className="p-4 space-y-3">
                    {employees.map(employee => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`manage-employee-${employee.id}`}
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleEmployeeSelection(employee.id)}
                        />
                        <label 
                          htmlFor={`manage-employee-${employee.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {employee.firstName} {employee.lastName} - {employee.position}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedEmployees.length} employé(s) sélectionné(s)
              </p>
            </div>
            
            {currentDepartment && getDepartmentEmployees(currentDepartment.id).length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Employés actuels du département:</h3>
                <div className="space-y-2">
                  {getDepartmentEmployees(currentDepartment.id).map(emp => (
                    <div key={emp.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                      <div className="text-sm text-gray-500">- {emp.position}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageEmployeesDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEmployeeAssignments}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesDepartments;
