
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { Employee } from '@/types/employee';
import { ChartNode, HierarchyVisualizationProps } from './types';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  viewMode, 
  searchQuery = '', 
  data,
  onRefresh
}) => {
  const { employees } = useEmployeeData();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
        node={node}
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
        node={node}
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
        <Tabs value={viewMode}>
          <TabsList className="mb-4">
            <TabsTrigger value="orgChart">Organigramme</TabsTrigger>
            <TabsTrigger value="treeView">Vue Arbre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orgChart" className="min-h-[400px]">
            <div className="mt-4 space-y-8">
              {data && 'position' in data ? (
                renderOrgChartNodes([data as ChartNode])
              ) : data && !('position' in data) ? (
                <div>Displaying hierarchy data...</div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Aucune hiérarchie d'employé n'a été trouvée.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="treeView" className="min-h-[400px]">
            <div className="mt-4">
              {data && 'position' in data ? (
                renderTreeViewNodes([data as ChartNode])
              ) : data && !('position' in data) ? (
                <div>Displaying hierarchy data...</div>
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
