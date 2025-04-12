
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HierarchyVisualization from './HierarchyVisualization';
import { HierarchyNode } from './types';
import { Department } from '@/components/module/submodules/departments/types';
import { Employee } from '@/types/employee';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { employees } from '@/data/employees';
import { subscribeToDepartmentUpdates } from '@/components/module/submodules/departments/utils/departmentUtils';

const EmployeesHierarchy: React.FC = () => {
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { departments, isLoading } = useFirebaseDepartments();
  
  // Build hierarchy data from departments and employees
  useEffect(() => {
    if (!isLoading && departments && departments.length > 0) {
      buildHierarchyData(departments);
    }
  }, [departments, isLoading]);
  
  // Subscribe to department updates for live synchronization
  useEffect(() => {
    const unsubscribe = subscribeToDepartmentUpdates((updatedDepartments) => {
      buildHierarchyData(updatedDepartments);
    });
    
    return () => unsubscribe();
  }, []);
  
  const buildHierarchyData = (departments: Department[]) => {
    // Find the direction/root department
    const rootDept = departments.find(dept => 
      dept.name.includes('Direction') || 
      dept.name.includes('CEO') || 
      dept.name.includes('Président')
    );
    
    if (!rootDept) {
      console.log('No root department found, using first department');
      // If no direction department, use the first one as root
      if (departments.length > 0) {
        createHierarchyFromDepartment(departments[0], departments);
      }
      return;
    }
    
    createHierarchyFromDepartment(rootDept, departments);
  };
  
  const createHierarchyFromDepartment = (rootDept: Department, allDepts: Department[]) => {
    // Get all employees for this department
    const deptEmployees = rootDept.employeeIds 
      ? employees.filter(emp => rootDept.employeeIds?.includes(emp.id))
      : employees.filter(emp => 
          (emp.department && typeof emp.department === 'string' && emp.department === rootDept.id) || 
          (emp.department && typeof emp.department === 'object' && emp.department?.id === rootDept.id) ||
          emp.departmentId === rootDept.id
        );
    
    // Find the manager
    const manager = deptEmployees.find(emp => emp.id === rootDept.managerId) || null;
    
    // Create the root node
    const rootNode: HierarchyNode = {
      id: rootDept.id,
      name: rootDept.name,
      title: 'Département',
      manager: manager ? `${manager.firstName} ${manager.lastName}` : 'Non défini',
      color: rootDept.color,
      children: []
    };
    
    // For each child department (simplified - assuming departments with parent are children)
    const childDepts = allDepts.filter(dept => 
      dept.id !== rootDept.id && 
      dept.parentDepartmentId === rootDept.id
    );
    
    // Add child departments
    childDepts.forEach(childDept => {
      const childNode = createDepartmentNode(childDept, allDepts);
      rootNode.children.push(childNode);
    });
    
    // Add employees that are not managers as direct children
    deptEmployees
      .filter(emp => emp.id !== rootDept.managerId)
      .forEach(emp => {
        rootNode.children.push({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          title: emp.position || 'Employé',
          color: '#64748b', // slate-500
          children: []
        });
      });
    
    setHierarchyData(rootNode);
  };
  
  const createDepartmentNode = (dept: Department, allDepts: Department[]): HierarchyNode => {
    // Get all employees for this department
    const deptEmployees = dept.employeeIds 
      ? employees.filter(emp => dept.employeeIds?.includes(emp.id))
      : employees.filter(emp => 
          (emp.department && typeof emp.department === 'string' && emp.department === dept.id) || 
          (emp.department && typeof emp.department === 'object' && emp.department?.id === dept.id) ||
          emp.departmentId === dept.id
        );
    
    // Find the manager
    const manager = deptEmployees.find(emp => emp.id === dept.managerId) || null;
    
    const deptNode: HierarchyNode = {
      id: dept.id,
      name: dept.name,
      title: 'Département',
      manager: manager ? `${manager.firstName} ${manager.lastName}` : 'Non défini',
      color: dept.color,
      children: []
    };
    
    // For each child department
    const childDepts = allDepts.filter(d => 
      d.id !== dept.id && 
      d.parentDepartmentId === dept.id
    );
    
    // Add child departments recursively
    childDepts.forEach(childDept => {
      const childNode = createDepartmentNode(childDept, allDepts);
      deptNode.children.push(childNode);
    });
    
    // Add employees that are not managers as direct children
    deptEmployees
      .filter(emp => emp.id !== dept.managerId)
      .forEach(emp => {
        deptNode.children.push({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          title: emp.position || 'Employé',
          color: '#64748b', // slate-500
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
