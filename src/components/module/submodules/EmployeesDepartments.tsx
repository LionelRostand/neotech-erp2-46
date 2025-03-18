
import React, { useState } from 'react';
import { Building, Plus, Edit, Trash2, User } from 'lucide-react';
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

// Define department interface
interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  managerName: string | null;
  employeesCount: number;
  color: string;
}

const EmployeesDepartments: React.FC = () => {
  // Initial departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "DEP001",
      name: "Marketing",
      description: "Responsable de la stratégie marketing et de la communication",
      managerId: "EMP003",
      managerName: "Sophie Martin",
      employeesCount: 2,
      color: "#3b82f6" // blue-500
    },
    {
      id: "DEP002",
      name: "Direction",
      description: "Direction générale de l'entreprise",
      managerId: "EMP002",
      managerName: "Lionel Djossa",
      employeesCount: 1,
      color: "#10b981" // emerald-500
    }
  ]);

  // State for dialog control and form data
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    managerId: "",
    color: "#3b82f6"
  });
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

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
      color: "#3b82f6"
    });
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
      color: department.color
    });
    setIsEditDialogOpen(true);
  };

  // Save new department
  const handleSaveDepartment = () => {
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
      employeesCount: 0,
      color: formData.color
    };

    setDepartments([...departments, newDepartment]);
    setIsAddDialogOpen(false);
    toast.success(`Département ${formData.name} créé avec succès`);
  };

  // Update existing department
  const handleUpdateDepartment = () => {
    if (!formData.name || !currentDepartment) {
      toast.error("Le nom du département est requis");
      return;
    }

    const selectedManager = formData.managerId 
      ? employees.find(emp => emp.id === formData.managerId) 
      : null;

    const updatedDepartments = departments.map(dep => {
      if (dep.id === currentDepartment.id) {
        return {
          ...dep,
          name: formData.name,
          description: formData.description,
          managerId: formData.managerId || null,
          managerName: selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : null,
          color: formData.color
        };
      }
      return dep;
    });

    setDepartments(updatedDepartments);
    setIsEditDialogOpen(false);
    toast.success(`Département ${formData.name} mis à jour avec succès`);
  };

  // Delete department
  const handleDeleteDepartment = (id: string) => {
    const departmentToDelete = departments.find(dep => dep.id === id);
    if (!departmentToDelete) return;

    // Confirm deletion
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${departmentToDelete.name} ?`)) {
      setDepartments(departments.filter(dep => dep.id !== id));
      toast.success(`Département ${departmentToDelete.name} supprimé avec succès`);
    }
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
                  <TableCell>{department.employeesCount}</TableCell>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau département</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          </div>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le département</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateDepartment}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesDepartments;
