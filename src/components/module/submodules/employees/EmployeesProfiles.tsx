
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Employee } from '@/types/employee';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, MoreHorizontal, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import EmployeeForm from './EmployeeForm';
import { EmployeeFormValues } from './form/employeeFormSchema';
import { formEmployeeToDb } from './utils/formAdapter';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getDepartmentName } from './utils/departmentUtils';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees = [], isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { departments } = useAvailableDepartments();

  const { add: addEmployee, update: updateEmployee } = useFirestore(COLLECTIONS.HR.EMPLOYEES);
  
  useEffect(() => {
    if (employees) {
      const filtered = employees.filter((employee) => {
        const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || 
               (employee.email && employee.email.toLowerCase().includes(query)) ||
               (employee.position && employee.position.toLowerCase().includes(query)) ||
               (employee.department && employee.department.toLowerCase().includes(query));
      });
      
      setFilteredEmployees(filtered);
    }
  }, [employees, searchQuery]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCreateEmployee = (formData: EmployeeFormValues) => {
    const newEmployee = formEmployeeToDb(formData);
    
    addEmployee({
      ...newEmployee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).then(() => {
      toast.success('Employé créé avec succès');
      setIsCreateModalOpen(false);
    }).catch((error) => {
      console.error("Error creating employee:", error);
      toast.error("Une erreur est survenue lors de la création de l'employé");
    });
  };
  
  const handleEditEmployee = (formData: EmployeeFormValues) => {
    if (!selectedEmployee?.id) return;
    
    const updatedEmployee = formEmployeeToDb(formData);
    
    updateEmployee(selectedEmployee.id, {
      ...updatedEmployee,
      updatedAt: new Date().toISOString()
    }).then(() => {
      toast.success('Employé mis à jour avec succès');
      setIsEditModalOpen(false);
    }).catch((error) => {
      console.error("Error updating employee:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'employé");
    });
  };
  
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // Remember to use proper loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Liste des employés</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full h-12 bg-gray-100 animate-pulse rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des employés</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un employé
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Employés ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NOM</TableHead>
                <TableHead>DÉPARTEMENT</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>DATE D'EMBAUCHE</TableHead>
                <TableHead>STATUT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Aucun employé trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    className="cursor-pointer"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
                          <AvatarFallback>
                            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                          <p className="text-xs text-muted-foreground">{employee.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDepartmentName(employee.departmentId || employee.department, departments)}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{formatDate(employee.hireDate)}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className={employee.status === 'active' ? 'bg-green-500' : ''}>
                        {employee.status === 'active' ? 'active' : employee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          </DialogHeader>
          <EmployeeForm 
            onSubmit={handleCreateEmployee}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier un employé</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            defaultValues={selectedEmployee || undefined}
            onSubmit={handleEditEmployee}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesProfiles;
