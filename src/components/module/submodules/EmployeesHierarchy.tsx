import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { refreshEmployeesData } from './employees/services/employeeService';
import HierarchyVisualization from './employees/hierarchy/HierarchyVisualization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmployeesHierarchy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [hierarchyData, setHierarchyData] = useState<ChartNode | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the real data from Firebase via our hooks
  const { employees, departments, isLoading: isDataLoading } = useEmployeeData();

  // Build the hierarchy data structure when employees or departments change
  useEffect(() => {
    if (!isDataLoading && employees.length > 0) {
      buildHierarchyData();
    }
  }, [employees, departments, isDataLoading, selectedDepartment]);

  const buildHierarchyData = () => {
    setLoading(true);
    
    try {
      // Filter employees if department selected
      const filteredEmployees = selectedDepartment === 'all' 
        ? employees 
        : employees.filter(emp => emp.departmentId === selectedDepartment || emp.department === selectedDepartment);

      if (filteredEmployees.length === 0) {
        setHierarchyData(null);
        setLoading(false);
        return;
      }
      
      // Find managers (employees who are managers of departments)
      const managers = departments
        .filter(dept => dept.managerId)
        .map(dept => dept.managerId as string);
      
      // Find CEO or top level employee (no manager)
      const topLevelEmployees = filteredEmployees.filter(emp => 
        (emp.position?.toLowerCase().includes('ceo') || 
         emp.position?.toLowerCase().includes('président') ||
         emp.position?.toLowerCase().includes('directeur général')) &&
        !emp.managerId
      );
      
      let rootEmployee: Employee | undefined;
      
      if (topLevelEmployees.length > 0) {
        rootEmployee = topLevelEmployees[0];
      } else {
        // If no CEO found, take the first employee with no manager
        rootEmployee = filteredEmployees.find(emp => !emp.managerId);
      }
      
      if (!rootEmployee) {
        // If still no root found, just take first employee
        rootEmployee = filteredEmployees[0];
      }
      
      // Build the tree recursively
      const buildEmployeeNode = (employee: Employee): ChartNode => {
        const employeeDept = departments.find(d => d.id === employee.departmentId);
        
        return {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          position: employee.position || 'Non défini',
          department: employeeDept?.name || employee.department || 'Non défini',
          imageUrl: employee.photoURL || employee.photo || '',
          children: getDirectReports(employee.id, filteredEmployees)
            .map(directReport => buildEmployeeNode(directReport))
        };
      };
      
      const getDirectReports = (managerId: string, empList: Employee[]): Employee[] => {
        return empList.filter(emp => emp.managerId === managerId);
      };
      
      // Start building from root
      const rootNode = buildEmployeeNode(rootEmployee);
      setHierarchyData(rootNode);
    } catch (error) {
      console.error('Error building hierarchy:', error);
      toast.error('Erreur lors de la génération de la hiérarchie');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    buildHierarchyData();
    toast.success('Données hiérarchiques actualisées');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hiérarchie</h2>
          <p className="text-gray-500">Visualisation de l'organigramme de l'entreprise</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Employés</h3>
              <p className="text-2xl font-bold">{isDataLoading ? <Skeleton className="h-8 w-16" /> : employees.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Départements</h3>
              <p className="text-2xl font-bold">{isDataLoading ? <Skeleton className="h-8 w-16" /> : departments.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Managers</h3>
              <p className="text-2xl font-bold">
                {isDataLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  departments.filter(dept => dept.managerId).length
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Rechercher un employé..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Département:</label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Affichage:</label>
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'orgChart' | 'treeView')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type d'affichage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orgChart">Organigramme</SelectItem>
              <SelectItem value="treeView">Vue arborescente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 min-h-[500px]">
          {loading || isDataLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500">Chargement de la hiérarchie...</p>
              </div>
            </div>
          ) : hierarchyData ? (
            <HierarchyVisualization 
              data={hierarchyData} 
              viewMode={viewMode} 
              searchQuery={searchQuery}
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Aucune donnée hiérarchique disponible</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
