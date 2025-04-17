
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { Employee } from '@/types/employee';

// Interface for node in the chart structure
interface ChartNode {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  photoURL?: string;
  photoMeta?: any;
  children: ChartNode[];
  // Include other employee properties needed
}

interface HierarchyVisualizationProps {
  searchQuery?: string;
}

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ searchQuery = '' }) => {
  const { employees } = useEmployeeData();
  const [selectedView, setSelectedView] = useState<'org-chart' | 'tree-view'>('org-chart');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Build the employee hierarchy
  const hierarchy = useMemo(() => {
    // Find root nodes (employees without managers or with managers not in the system)
    const managerIds = new Set(employees.map(e => e.managerId).filter(Boolean));
    const employeeIds = new Set(employees.map(e => e.id));
    
    const rootEmployees = employees.filter(e => 
      !e.managerId || !employeeIds.has(e.managerId) || e.forceManager
    );

    // Build the hierarchy tree recursively
    const buildHierarchy = (rootNodes: Employee[]): ChartNode[] => {
      return rootNodes.map(employee => {
        const directReports = employees.filter(e => e.managerId === employee.id);
        
        return {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position || employee.title || 'N/A',
          department: employee.department || 'N/A',
          photoURL: employee.photoURL || employee.photo || '',
          photoMeta: employee.photoMeta,
          children: buildHierarchy(directReports)
        };
      });
    };

    return buildHierarchy(rootEmployees);
  }, [employees]);

  // Handle toggle node expansion in tree view
  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Render org chart nodes recursively
  const renderOrgChartNodes = (nodes: ChartNode[]) => {
    return nodes.map(node => (
      <OrgChartNode
        key={node.id}
        employee={node as any} // Cast to Employee for compatibility
        searchQuery={searchQuery}
        onSelect={() => handleSelectEmployee(node.id)}
      >
        {node.children.length > 0 && renderOrgChartNodes(node.children)}
      </OrgChartNode>
    ));
  };

  // Render tree view nodes recursively
  const renderTreeViewNodes = (nodes: ChartNode[]) => {
    return nodes.map(node => (
      <TreeViewNode
        key={node.id}
        employee={node as any} // Cast to Employee for compatibility
        expanded={expandedNodes.has(node.id)}
        onToggleExpand={() => handleToggleExpand(node.id)}
        onSelectNode={() => handleSelectEmployee(node.id)}
        searchQuery={searchQuery}
      >
        {node.children.length > 0 && renderTreeViewNodes(node.children)}
      </TreeViewNode>
    ));
  };

  // Handle employee selection
  const handleSelectEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId) || null;
    setSelectedEmployee(employee);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
          <TabsList className="mb-4">
            <TabsTrigger value="org-chart">Organigramme</TabsTrigger>
            <TabsTrigger value="tree-view">Vue Arbre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="org-chart" className="min-h-[400px]">
            <div className="mt-4 space-y-8">
              {hierarchy.length > 0 ? (
                renderOrgChartNodes(hierarchy)
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Aucune hiérarchie d'employé n'a été trouvée.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tree-view" className="min-h-[400px]">
            <div className="mt-4">
              {hierarchy.length > 0 ? (
                renderTreeViewNodes(hierarchy)
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Aucune hiérarchie d'employé n'a été trouvée.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HierarchyVisualization;
