
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { Employee } from '@/types/employee';
import { ChartNode, HierarchyNode } from './types/hierarchy-types';
import EmptyHierarchy from './components/EmptyHierarchy';

interface HierarchyVisualizationProps {
  viewMode: 'orgChart' | 'treeView';
  searchQuery?: string;
  data: HierarchyNode | null;
  onRefresh?: () => void;
}

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  viewMode, 
  searchQuery = '', 
  data,
  onRefresh
}) => {
  const { employees } = useEmployeeData();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Convertir HierarchyNode en ChartNode pour la visualisation
  const convertToChartNode = (node: HierarchyNode): ChartNode => {
    return {
      id: node.id,
      name: node.name || `${node.employee.firstName} ${node.employee.lastName}`,
      position: node.position || node.title || node.employee.position || 'Employé',
      department: node.department || node.employee.department,
      departmentColor: node.departmentColor,
      imageUrl: node.imageUrl || node.employee.photoURL,
      children: node.children.map(child => convertToChartNode(child))
    };
  };

  const chartData = useMemo(() => {
    if (!data) return null;
    return convertToChartNode(data);
  }, [data]);

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
    return chartData && chartData.id;
  }, [chartData]);

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
              {hasValidHierarchyData && chartData ? (
                renderOrgChartNodes([chartData])
              ) : (
                <EmptyHierarchy onRefresh={onRefresh} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="treeView" className="min-h-[400px]">
            <div className="mt-4">
              {hasValidHierarchyData && chartData ? (
                renderTreeViewNodes([chartData])
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
