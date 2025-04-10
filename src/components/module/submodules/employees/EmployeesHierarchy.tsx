
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { refreshEmployeesData } from './services/employeeService';
import HierarchyVisualization from './hierarchy/HierarchyVisualization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmployeesHierarchy: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const fetchEmployeesData = async () => {
    setIsLoading(true);
    try {
      const data = await refreshEmployeesData();
      setEmployees(data);
      
      // Extract unique departments
      const uniqueDepartments = Array.from(
        new Set(data.map(emp => emp.department).filter(Boolean))
      );
      setDepartments(uniqueDepartments as string[]);
      
      applyFilters(data, searchQuery, departmentFilter);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employees data:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = (data: Employee[], search: string, department: string) => {
    let result = [...data];
    
    // Apply department filter
    if (department !== 'all') {
      result = result.filter(emp => emp.department === department);
    }
    
    // Apply search filter
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      result = result.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower) ||
        emp.position?.toLowerCase().includes(searchLower) ||
        emp.department?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredEmployees(result);
  };

  useEffect(() => {
    applyFilters(employees, searchQuery, departmentFilter);
  }, [searchQuery, departmentFilter, employees]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hiérarchie des employés</h1>
          <p className="text-slate-500">Visualisez la structure organisationnelle de l'entreprise</p>
        </div>
        <Button 
          onClick={fetchEmployeesData} 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un employé..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Department Filter */}
            <div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map((dept, i) => (
                    <SelectItem key={i} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Hierarchy Visualization */}
          {filteredEmployees.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Users className="h-12 w-12 text-slate-400 mb-3" />
              <h3 className="text-lg font-medium">Aucun employé trouvé</h3>
              <p className="text-slate-500 mt-1">
                Essayez d'ajuster vos critères de recherche.
              </p>
            </div>
          ) : (
            <HierarchyVisualization employees={filteredEmployees} loading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
