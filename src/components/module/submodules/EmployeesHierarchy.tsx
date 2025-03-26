
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/employees';
import { Employee } from '@/types/employee';
import { ListTree, Users, Building, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { useDepartmentService } from './departments/services/departmentService';
import { Department as DepartmentType } from './departments/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Interface pour employé dans la hiérarchie
interface EmployeeNode extends Employee {
  subordinates: EmployeeNode[];
  managerOf?: string[];
  departmentColor?: string;
  level?: number;
}

const EmployeesHierarchy: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for hierarchy data
  const [employeeHierarchy, setEmployeeHierarchy] = useState<EmployeeNode[]>([]);
  const [activeTab, setActiveTab] = useState("employees");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Get departments from service
  const departmentService = useDepartmentService();

  // Function to refresh data manually
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDepartments();
      toast.success("Hiérarchie mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la hiérarchie");
      console.error("Error refreshing hierarchy:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load departments and build hierarchy function
  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const departmentsData = await departmentService.getAll();
      console.log("Fetched departments for hierarchy:", departmentsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error loading departments for hierarchy:", error);
    } finally {
      setLoading(false);
    }
  }, [departmentService]);
  
  // Load departments on component mount and refresh trigger changes
  useEffect(() => {
    console.log("Loading departments, refresh trigger:", refreshTrigger);
    loadDepartments();
  }, [loadDepartments, refreshTrigger]);

  // Listen for department update events
  useEffect(() => {
    const handleDepartmentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Department updated:", customEvent.detail);
      
      // Refresh hierarchy data
      setRefreshTrigger(prev => prev + 1);
      
      // Show toast notification
      const { action, department, id, name } = customEvent.detail;
      if (action === 'create') {
        toast.info(`Département "${department.name}" créé - Hiérarchie mise à jour`);
      } else if (action === 'update') {
        toast.info(`Département "${department.name}" modifié - Hiérarchie mise à jour`);
      } else if (action === 'delete') {
        toast.info(`Département "${name}" supprimé - Hiérarchie mise à jour`);
      }
    };

    window.addEventListener('department-updated', handleDepartmentUpdate);
    
    return () => {
      window.removeEventListener('department-updated', handleDepartmentUpdate);
    };
  }, []);

  // Rebuild hierarchy when departments change
  useEffect(() => {
    if (departments.length > 0) {
      console.log("Rebuilding employee hierarchy with departments:", departments);
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
          className={`flex items-center py-2 transition-colors hover:bg-gray-50 rounded-md`}
          style={{ 
            paddingLeft: `${level * 20 + 8}px`, 
            borderLeft: node.departmentColor ? `2px solid ${node.departmentColor}` : 'none'
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

  // Render departments with pyramid style
  const renderDepartmentsPyramid = () => {
    if (loading) {
      return <div className="flex justify-center py-8">Chargement des départements...</div>;
    }

    if (departments.length === 0) {
      return <div className="text-center py-8">Aucun département n'est configuré</div>;
    }

    // Group employees by department
    const departmentEmployees = departments.map(department => {
      // Find employees for this department using employeeIds from department
      const deptEmployees = employees.filter(emp => 
        department.employeeIds && department.employeeIds.includes(emp.id)
      );
      
      return {
        ...department,
        employees: deptEmployees,
        manager: employees.find(emp => emp.id === department.managerId),
        count: deptEmployees.length
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
                {department.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Department Manager */}
              {department.manager ? (
                <div className="mb-6">
                  <div className="text-center relative">
                    <div className="inline-block p-4 bg-gray-100 rounded-lg mb-2 border-2 shadow-sm" 
                         style={{ borderColor: department.color }}>
                      <div className="font-bold">{department.manager.firstName} {department.manager.lastName}</div>
                      <div className="text-sm text-gray-600">{department.manager.position}</div>
                      <div className="text-xs mt-1 py-1 px-2 rounded-full" 
                           style={{ backgroundColor: department.color, color: 'white' }}>
                        Responsable
                      </div>
                    </div>
                    
                    {/* Connecting line to subordinates */}
                    {department.employees.length > 1 && (
                      <div className="w-0.5 h-6 bg-gray-300 mx-auto"></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mb-6">Aucun responsable assigné</div>
              )}
              
              {/* Department Employees */}
              {department.employees.length > 0 ? (
                <div className="mt-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    {department.employees
                      .filter(emp => emp.id !== department.managerId) // Exclude the manager
                      .map(emp => (
                        <div key={emp.id} 
                             className="p-3 bg-gray-50 rounded-md shadow-sm border text-center w-[150px]">
                          <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                          <div className="text-sm text-gray-500">{emp.position}</div>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hiérarchie de l'entreprise</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
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
              {loading ? (
                <div className="flex justify-center py-8">Chargement des données...</div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] p-2">
                    {employeeHierarchy.map(node => renderEmployeeNode(node))}
                  </div>
                </div>
              )}
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
