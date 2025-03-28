import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/employees';
import { Employee } from '@/types/employee';
import { ListTree, Users, Building, ChevronRight, ChevronDown } from 'lucide-react';
import { getSyncedDepartments } from './departments/utils/departmentUtils';

// Interface pour département dans la hiérarchie
interface Department {
  id: string;
  name: string;
  managerId: string | null;
  managerName: string | null;
  color: string;
  employeeIds?: string[];
  employeesCount?: number;
}

// Interface pour employé dans la hiérarchie
interface EmployeeNode extends Employee {
  subordinates: EmployeeNode[];
  managerOf?: string[];
  departmentColor?: string;
  level?: number;
}

const EmployeesHierarchy: React.FC = () => {
  // Départements - maintenant synchronisés avec la gestion des départements
  const [departments, setDepartments] = useState<Department[]>([]);

  // State for hierarchy data
  const [employeeHierarchy, setEmployeeHierarchy] = useState<EmployeeNode[]>([]);
  const [activeTab, setActiveTab] = useState("employees");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fetch departments from synced storage
  useEffect(() => {
    const loadSyncedDepartments = () => {
      const syncedDepartments = getSyncedDepartments();
      if (syncedDepartments && syncedDepartments.length > 0) {
        console.log("Loaded synced departments:", syncedDepartments);
        setDepartments(syncedDepartments);
      } else {
        // Fallback to default departments
        setDepartments([
          {
            id: "DEP001",
            name: "Marketing",
            managerId: "EMP003",
            managerName: "Sophie Martin",
            color: "#3b82f6", // blue-500
            employeesCount: 2,
            employeeIds: ["EMP003", "EMP004"]
          },
          {
            id: "DEP002",
            name: "Direction",
            managerId: "EMP002",
            managerName: "Lionel Djossa",
            color: "#10b981", // emerald-500
            employeesCount: 1,
            employeeIds: ["EMP002"]
          },
          {
            id: "DEP003",
            name: "Finance",
            managerId: "EMP005",
            managerName: "Marie Dupont",
            color: "#8b5cf6", // violet-500
            employeesCount: 3,
            employeeIds: ["EMP005", "EMP006", "EMP010"]
          },
          {
            id: "DEP004",
            name: "Technique",
            managerId: "EMP007",
            managerName: "Jean Leroy",
            color: "#f59e0b", // amber-500
            employeesCount: 2,
            employeeIds: ["EMP007", "EMP008"]
          },
          {
            id: "DEP005",
            name: "Ressources Humaines",
            managerId: "EMP009",
            managerName: "Camille Rousseau",
            color: "#ec4899", // pink-500
            employeesCount: 1,
            employeeIds: ["EMP009"]
          },
        ]);
      }
    };

    loadSyncedDepartments();

    // Listen for storage changes to keep departments in sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hierarchy_departments_data') {
        loadSyncedDepartments();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Build employee hierarchy on component mount and when departments change
  useEffect(() => {
    if (departments.length > 0) {
      buildEmployeeHierarchy();
    }
  }, [departments]);

  // Toggle node expansion
  const toggleNodeExpansion = (employeeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  // Function to build employee hierarchy
  const buildEmployeeHierarchy = () => {
    // Create a map of employees by ID
    const employeeMap = new Map<string, EmployeeNode>();
    
    // First, create nodes for all employees
    const employeeNodes: EmployeeNode[] = employees.map(emp => {
      const node: EmployeeNode = {
        ...emp,
        subordinates: [],
        managerOf: [],
        level: 0
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
    
    // Then, build the hierarchy by adding subordinates and setting levels
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
            node.level = (manager.level || 0) + 1;
          }
          return; // This node is not a root node
        }
      }
      
      // If we reach here, this employee has no manager in our system or is at the top of the hierarchy
      rootNodes.push(node);
    });
    
    // Expand all root nodes by default
    const initialExpanded = new Set<string>();
    rootNodes.forEach(node => initialExpanded.add(node.id));
    setExpandedNodes(initialExpanded);
    
    setEmployeeHierarchy(rootNodes);
  };

  // Recursive component to render employee hierarchy
  const renderEmployeeNode = (node: EmployeeNode, level: number = 0) => {
    const hasSubordinates = node.subordinates.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    
    return (
      <div key={node.id} className="relative">
        <div 
          className={`flex items-center py-2 pl-${level * 4} transition-colors hover:bg-gray-50 rounded-md`}
          style={{ 
            paddingLeft: `${level * 20 + 8}px`, 
            borderLeft: node.departmentColor ? `3px solid ${node.departmentColor}` : 'none'
          }}
        >
          {hasSubordinates && (
            <button 
              onClick={() => toggleNodeExpansion(node.id)}
              className="mr-2 focus:outline-none"
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                <ChevronRight className="h-4 w-4 text-gray-500" />
              }
            </button>
          )}
          
          {!hasSubordinates && <div className="w-6 mr-2"></div>}
          
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
        
        {isExpanded && node.subordinates.length > 0 && (
          <div className="ml-6 border-l border-gray-200 pl-2">
            {node.subordinates.map(subordinate => renderEmployeeNode(subordinate, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render departments with improved pyramid style
  const renderDepartmentsPyramid = () => {
    // Group employees by department
    const departmentEmployees = departments.map(department => {
      // Use employeeIds from synced departments if available
      let deptEmployees = [];
      if (department.employeeIds && department.employeeIds.length > 0) {
        deptEmployees = employees.filter(emp => department.employeeIds!.includes(emp.id));
      } else {
        deptEmployees = employees.filter(emp => emp.department === department.name);
      }
      
      return {
        ...department,
        employees: deptEmployees,
        manager: employees.find(emp => emp.id === department.managerId),
        count: department.employeesCount || deptEmployees.length
      };
    });

    return (
      <div className="space-y-8 mt-4">
        {departmentEmployees.map(department => (
          <Card key={department.id} className="overflow-hidden">
            <div className="h-2" style={{ backgroundColor: department.color }}></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" style={{ color: department.color }} />
                {department.name} <span className="text-sm font-normal text-gray-500">({department.count} membres)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Department Manager */}
              {department.manager ? (
                <div className="mb-6">
                  <div className="text-center relative">
                    <div 
                      className="inline-block p-4 bg-gray-100 rounded-lg mb-2 border-2 shadow-sm transform hover:scale-105 transition-transform" 
                      style={{ borderColor: department.color }}
                    >
                      <div className="font-bold">{department.managerName}</div>
                      <div className="text-sm text-gray-600">{department.manager.position}</div>
                      <div 
                        className="text-xs mt-1 py-1 px-2 rounded-full" 
                        style={{ backgroundColor: department.color, color: 'white' }}
                      >
                        Responsable
                      </div>
                    </div>
                    
                    {/* Connecting lines to subordinates */}
                    {department.employees.length > 0 && (
                      <>
                        <div className="w-0.5 h-10 bg-gray-300 mx-auto"></div>
                        <div className="w-full h-0.5 bg-gray-300 absolute left-0 bottom-0"></div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mb-6">Aucun responsable assigné</div>
              )}
              
              {/* Department Employees */}
              {department.employees.length > 0 ? (
                <div className="mt-12">
                  <div className="flex flex-wrap justify-center gap-4">
                    {department.employees
                      .filter(emp => emp.id !== department.managerId) // Exclude the manager
                      .map(emp => (
                        <div 
                          key={emp.id} 
                          className="p-3 bg-gray-50 rounded-md shadow-sm border text-center w-[160px] hover:shadow-md transition-shadow"
                          style={{ borderTop: `3px solid ${department.color}` }}
                        >
                          <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                          <div className="text-sm text-gray-500">{emp.position}</div>
                          <div className="text-xs text-gray-400 mt-1">{emp.email}</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-4">
                  Aucun employé dans ce département
                </div>
              )}
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
                <div className="min-w-[600px] p-2">
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
              {renderDepartmentsPyramid()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesHierarchy;
