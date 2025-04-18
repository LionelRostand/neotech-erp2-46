
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { Employee } from '@/types/employee';
import { ChartNode, HierarchyVisualizationProps } from './types';
import EmptyHierarchy from './components/EmptyHierarchy';

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

  // Vérifier si nous avons des données valides pour afficher la hiérarchie
  const hasValidHierarchyData = useMemo(() => {
    return data && 
           (('position' in data && data.position) || 
            ('title' in data && data.title)) &&
           data.children &&
           data.id;
  }, [data]);

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
              {hasValidHierarchyData ? (
                renderOrgChartNodes([data as ChartNode])
              ) : (
                <EmptyHierarchy onRefresh={onRefresh} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="treeView" className="min-h-[400px]">
            <div className="mt-4">
              {hasValidHierarchyData ? (
                renderTreeViewNodes([data as ChartNode])
              ) : (
                <EmptyHierarchy onRefresh={onRefresh} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HierarchyVisualization;
