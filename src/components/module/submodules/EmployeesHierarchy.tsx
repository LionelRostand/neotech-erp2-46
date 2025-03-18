
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/employees';
import { Employee } from '@/types/employee';
import { ListTree, Users, Building } from 'lucide-react';

// Interface for department in hierarchy
interface Department {
  id: string;
  name: string;
  managerId: string | null;
  managerName: string | null;
  color: string;
}

// Interface for employee node in hierarchy
interface EmployeeNode extends Employee {
  subordinates: EmployeeNode[];
  managerOf?: string[];
  departmentColor?: string;
}

const EmployeesHierarchy: React.FC = () => {
  // Sample departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "DEP001",
      name: "Marketing",
      managerId: "EMP003",
      managerName: "Sophie Martin",
      color: "#3b82f6" // blue-500
    },
    {
      id: "DEP002",
      name: "Direction",
      managerId: "EMP002",
      managerName: "Lionel Djossa",
      color: "#10b981" // emerald-500
    }
  ]);

  // State for hierarchy data
  const [employeeHierarchy, setEmployeeHierarchy] = useState<EmployeeNode[]>([]);
  const [activeTab, setActiveTab] = useState("employees");

  // Build employee hierarchy on component mount
  useEffect(() => {
    buildEmployeeHierarchy();
  }, []);

  // Function to build employee hierarchy
  const buildEmployeeHierarchy = () => {
    // Create a map of employees by ID
    const employeeMap = new Map<string, EmployeeNode>();
    
    // First, create nodes for all employees
    const employeeNodes: EmployeeNode[] = employees.map(emp => {
      const node: EmployeeNode = {
        ...emp,
        subordinates: [],
        managerOf: []
      };
      
      // Add department color if employee is a manager of a department
      const managedDepartment = departments.find(dep => dep.managerId === emp.id);
      if (managedDepartment) {
        node.departmentColor = managedDepartment.color;
        node.managerOf = [managedDepartment.name];
      }
      
      employeeMap.set(emp.id, node);
      return node;
    });
    
    // Then, build the hierarchy by adding subordinates
    const rootNodes: EmployeeNode[] = [];
    
    employeeNodes.forEach(node => {
      // If this employee has a manager, add them as a subordinate to their manager
      if (node.manager) {
        // Find the manager in our employee list
        const managerNode = employeeNodes.find(emp => 
          `${emp.firstName} ${emp.lastName}` === node.manager
        );
        
        if (managerNode) {
          const manager = employeeMap.get(managerNode.id);
          if (manager) {
            manager.subordinates.push(node);
          }
          return; // This node is not a root node
        }
      }
      
      // If we reach here, this employee has no manager in our system or is at the top of the hierarchy
      rootNodes.push(node);
    });
    
    setEmployeeHierarchy(rootNodes);
  };

  // Recursive component to render employee hierarchy
  const renderEmployeeNode = (node: EmployeeNode, level: number = 0) => {
    return (
      <div key={node.id} className="ml-4" style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center py-2 my-1 border-l-2 pl-3" style={{ borderColor: node.departmentColor || '#e5e7eb' }}>
          <div className="flex-1">
            <div className="font-medium">{node.firstName} {node.lastName}</div>
            <div className="text-sm text-gray-500">{node.position}</div>
            {node.managerOf && node.managerOf.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                <div 
                  className="inline-block px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: node.departmentColor }}
                >
                  Responsable {node.managerOf.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {node.subordinates.length > 0 && (
          <div className="ml-5">
            {node.subordinates.map(subordinate => renderEmployeeNode(subordinate, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render departments hierarchy
  const renderDepartmentsHierarchy = () => {
    return (
      <div className="space-y-4 mt-4">
        {departments.map(department => (
          <Card key={department.id} className="overflow-hidden">
            <div 
              className="h-2" 
              style={{ backgroundColor: department.color }}
            ></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" style={{ color: department.color }} />
                {department.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {department.managerId ? (
                <div className="mb-2">
                  <div className="text-sm text-gray-500">Responsable:</div>
                  <div className="font-medium">{department.managerName}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 mb-2">Aucun responsable assigné</div>
              )}
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Employés du département:</div>
                <div className="space-y-2">
                  {employees
                    .filter(emp => emp.department === department.name)
                    .map(emp => (
                      <div key={emp.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-sm text-gray-500">- {emp.position}</div>
                      </div>
                    ))
                  }
                  {employees.filter(emp => emp.department === department.name).length === 0 && (
                    <div className="text-sm text-gray-500">Aucun employé dans ce département</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hiérarchie de l'entreprise</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Par employés</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Par départements</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ListTree className="h-5 w-5" />
                Organigramme des employés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {employeeHierarchy.map(node => renderEmployeeNode(node))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organisation par départements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderDepartmentsHierarchy()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesHierarchy;
