
import React from 'react';
import { Employee } from '@/types/employee';
import { Card } from '@/components/ui/card';
import { User, Users } from 'lucide-react';

interface HierarchyNode {
  id: string;
  name: string;
  position: string;
  department?: string;
  photo?: string;
  children: HierarchyNode[];
}

interface HierarchyVisualizationProps {
  employees: Employee[];
  loading?: boolean;
}

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ employees, loading = false }) => {
  // Build hierarchy tree from flat employees list
  const buildHierarchyTree = (): HierarchyNode[] => {
    // Find managers (employees with no manager or whose managerId doesn't exist)
    const managerIds = new Set(employees.map(emp => emp.managerId).filter(Boolean));
    const allIds = new Set(employees.map(emp => emp.id));
    
    // Find root employees (those who are not managed by anyone in the list)
    const rootEmployees = employees.filter(emp => 
      !emp.managerId || !allIds.has(emp.managerId)
    );
    
    // Create tree nodes
    const createNode = (employee: Employee): HierarchyNode => {
      // Find all direct reports
      const children = employees
        .filter(emp => emp.managerId === employee.id)
        .map(createNode);
      
      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        position: employee.position || 'N/A',
        department: employee.department,
        photo: employee.photoURL || employee.photo,
        children
      };
    };
    
    return rootEmployees.map(createNode);
  };
  
  // Recursively render a node and its children
  const renderNode = (node: HierarchyNode, level = 0) => {
    return (
      <div key={node.id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
        <Card className="p-3 flex items-center bg-white hover:bg-slate-50 transition-colors">
          {node.photo ? (
            <img 
              src={node.photo} 
              alt={node.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-slate-500" />
            </div>
          )}
          
          <div>
            <div className="font-medium">{node.name}</div>
            <div className="text-sm text-slate-500">{node.position}</div>
            {node.department && <div className="text-xs text-slate-400">{node.department}</div>}
          </div>
        </Card>
        
        {node.children.length > 0 && (
          <div className="pl-5 border-l border-slate-200 ml-5 mt-2">
            {node.children.map(childNode => renderNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-200 rounded"></div>
        ))}
      </div>
    );
  }
  
  const hierarchyTree = buildHierarchyTree();
  
  if (hierarchyTree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Users className="h-12 w-12 text-slate-400 mb-3" />
        <h3 className="text-lg font-medium">Aucune hiérarchie trouvée</h3>
        <p className="text-slate-500 mt-1">
          Aucun employé n'a été trouvé ou les relations hiérarchiques ne sont pas définies.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {hierarchyTree.map(node => renderNode(node))}
    </div>
  );
};

export default HierarchyVisualization;
