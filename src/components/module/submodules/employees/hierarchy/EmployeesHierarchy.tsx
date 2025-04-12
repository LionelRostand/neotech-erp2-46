
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HierarchyVisualization from './HierarchyVisualization';
import { HierarchyNode } from './types';
import { Department } from '@/components/module/submodules/departments/types';
import { Employee } from '@/types/employee';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { employees } from '@/data/employees';
import { subscribeToDepartmentUpdates } from '@/components/module/submodules/departments/utils/departmentUtils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const EmployeesHierarchy: React.FC = () => {
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { departments, isLoading } = useFirebaseDepartments();
  
  useEffect(() => {
    if (!isLoading && departments && departments.length > 0) {
      buildHierarchyData(departments);
    }
  }, [departments, isLoading]);
  
  useEffect(() => {
    const unsubscribe = subscribeToDepartmentUpdates((updatedDepartments) => {
      buildHierarchyData(updatedDepartments);
    });
    
    return () => unsubscribe();
  }, []);
  
  const buildHierarchyData = (departments: Department[]) => {
    const rootDept = departments.find(dept => 
      dept.name.includes('Direction') || 
      dept.name.includes('CEO') || 
      dept.name.includes('Président')
    );
    
    if (!rootDept) {
      console.log('No root department found, using first department');
      if (departments.length > 0) {
        createHierarchyFromDepartment(departments[0], departments);
      }
      return;
    }
    
    createHierarchyFromDepartment(rootDept, departments);
  };
  
  const createHierarchyFromDepartment = (rootDept: Department, allDepts: Department[]) => {
    // Récupérer tous les employés du département, y compris le manager
    const deptEmployees = rootDept.employeeIds 
      ? employees.filter(emp => rootDept.employeeIds?.includes(emp.id))
      : employees.filter(emp => {
          if (emp.department === null || emp.department === undefined) {
            return emp.departmentId === rootDept.id;
          }
          
          if (typeof emp.department === 'string') {
            return emp.department === rootDept.id;
          }
          
          if (typeof emp.department === 'object' && emp.department !== null && 'id' in emp.department) {
            return (emp.department as { id: string }).id === rootDept.id;
          }
          
          return false;
        });
    
    // Trouver le manager du département
    const manager = deptEmployees.find(emp => emp.id === rootDept.managerId) || null;
    
    // Créer le nœud racine pour le département
    const rootNode: HierarchyNode = {
      id: rootDept.id,
      name: rootDept.name,
      title: 'Département',
      manager: manager ? `${manager.firstName} ${manager.lastName}` : 'Non défini',
      color: rootDept.color,
      children: []
    };
    
    // Ajouter d'abord le manager comme premier enfant s'il existe
    if (manager) {
      rootNode.children.push({
        id: manager.id,
        name: `${manager.firstName} ${manager.lastName}`,
        title: manager.position || 'Manager',
        color: '#4B5563', // Couleur différente pour le manager
        children: []
      });
    }
    
    // Ajouter les départements enfants
    const childDepts = allDepts.filter(dept => 
      dept.id !== rootDept.id && 
      dept.parentDepartmentId === rootDept.id
    );
    
    childDepts.forEach(childDept => {
      const childNode = createDepartmentNode(childDept, allDepts);
      rootNode.children.push(childNode);
    });
    
    // Ajouter les autres employés (qui ne sont pas le manager)
    deptEmployees
      .filter(emp => emp.id !== rootDept.managerId)
      .forEach(emp => {
        rootNode.children.push({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          title: emp.position || 'Employé',
          color: '#64748b',
          children: []
        });
      });
    
    setHierarchyData(rootNode);
  };
  
  const createDepartmentNode = (dept: Department, allDepts: Department[]): HierarchyNode => {
    // Récupérer tous les employés du département, y compris le manager
    const deptEmployees = dept.employeeIds 
      ? employees.filter(emp => dept.employeeIds?.includes(emp.id))
      : employees.filter(emp => {
          if (emp.department === null || emp.department === undefined) {
            return emp.departmentId === dept.id;
          }
          
          if (typeof emp.department === 'string') {
            return emp.department === dept.id;
          }
          
          if (typeof emp.department === 'object' && emp.department !== null && 'id' in emp.department) {
            return (emp.department as { id: string }).id === dept.id;
          }
          
          return false;
        });
    
    // Trouver le manager du département
    const manager = deptEmployees.find(emp => emp.id === dept.managerId) || null;
    
    // Créer le nœud pour le département
    const deptNode: HierarchyNode = {
      id: dept.id,
      name: dept.name,
      title: 'Département',
      manager: manager ? `${manager.firstName} ${manager.lastName}` : 'Non défini',
      color: dept.color,
      children: []
    };
    
    // Ajouter d'abord le manager comme premier enfant s'il existe
    if (manager) {
      deptNode.children.push({
        id: manager.id,
        name: `${manager.firstName} ${manager.lastName}`,
        title: manager.position || 'Manager',
        color: '#4B5563', // Couleur différente pour le manager
        children: []
      });
    }
    
    // Ajouter les départements enfants
    const childDepts = allDepts.filter(d => 
      d.id !== dept.id && 
      d.parentDepartmentId === dept.id
    );
    
    childDepts.forEach(childDept => {
      const childNode = createDepartmentNode(childDept, allDepts);
      deptNode.children.push(childNode);
    });
    
    // Ajouter les autres employés (qui ne sont pas le manager)
    deptEmployees
      .filter(emp => emp.id !== dept.managerId)
      .forEach(emp => {
        deptNode.children.push({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          title: emp.position || 'Employé',
          color: '#64748b',
          children: []
        });
      });
    
    return deptNode;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'organigramme...</p>
        </div>
      </div>
    );
  }
  
  if (!hierarchyData) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Aucun département trouvé</h3>
          <p className="text-muted-foreground">
            Pour afficher l'organigramme, veuillez d'abord créer des départements et y assigner des employés et des responsables.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé ou un département..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardContent className="p-6 overflow-auto">
          <HierarchyVisualization 
            data={hierarchyData} 
            viewMode="orgChart" 
            searchQuery={searchQuery} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
