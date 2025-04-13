
import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Users } from 'lucide-react';
import { ChartNode, HierarchyNode, HierarchyVisualizationProps } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data, 
  viewMode, 
  searchQuery 
}) => {
  // Helper function to check if a node or its children match the search query
  const nodeMatchesSearch = (node: ChartNode | HierarchyNode, query: string): boolean => {
    if (!query.trim()) return true;
    
    const searchLower = query.toLowerCase();
    const nodeName = node.name.toLowerCase();
    const nodePosition = 'position' in node ? node.position.toLowerCase() : node.title.toLowerCase();
    const nodeDepartment = 'department' in node && node.department ? node.department.toLowerCase() : '';
    
    if (
      nodeName.includes(searchLower) ||
      nodePosition.includes(searchLower) ||
      nodeDepartment.includes(searchLower)
    ) {
      return true;
    }
    
    // Check children
    return node.children.some(child => nodeMatchesSearch(child, query));
  };
  
  // Convert HierarchyNode to ChartNode if needed
  const getChartNode = (node: HierarchyNode): ChartNode => {
    return {
      id: node.id,
      name: node.name,
      position: node.title,
      department: node.manager ? `Manager: ${node.manager}` : undefined,
      children: node.children.map(child => getChartNode(child))
    };
  };
  
  // Ensure we're working with a ChartNode
  const chartData = 'position' in data ? data : getChartNode(data as HierarchyNode);
  
  // Get initials from name for avatar fallback
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  // OrgChart view rendering
  const renderOrgChart = (node: ChartNode) => {
    if (!nodeMatchesSearch(node, searchQuery)) return null;
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <Card className="p-4 flex flex-col items-center w-56 text-center mb-2 shadow-md hover:shadow-lg transition-shadow">
          <Avatar className="h-20 w-20 mb-2">
            {node.imageUrl ? (
              <AvatarImage src={node.imageUrl} alt={node.name} />
            ) : null}
            <AvatarFallback className="bg-slate-200 text-slate-700 text-lg">
              {getInitials(node.name)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{node.name}</div>
          <div className="text-sm text-slate-500">{node.position}</div>
          {node.department && <div className="text-xs text-slate-400">{node.department}</div>}
        </Card>
        
        {node.children.length > 0 && (
          <div className="relative pt-6">
            <div className="absolute top-0 left-1/2 h-6 w-0.5 -ml-px bg-slate-300"></div>
            <div className="flex flex-wrap justify-center gap-10">
              {node.children.map(child => (
                <div key={child.id} className="relative pt-6">
                  <div className="absolute top-0 left-1/2 h-6 w-0.5 -ml-px bg-slate-300"></div>
                  {renderOrgChart(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // TreeView rendering
  const renderTreeView = (node: ChartNode, level = 0) => {
    if (!nodeMatchesSearch(node, searchQuery)) return null;
    
    return (
      <div key={node.id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
        <Card className="p-3 flex items-center bg-white hover:bg-slate-50 transition-colors">
          <Avatar className="h-10 w-10 mr-3">
            {node.imageUrl ? (
              <AvatarImage src={node.imageUrl} alt={node.name} />
            ) : null}
            <AvatarFallback className="bg-slate-200 text-slate-700">
              {getInitials(node.name)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="font-medium">{node.name}</div>
            <div className="text-sm text-slate-500">{node.position}</div>
            {node.department && <div className="text-xs text-slate-400">{node.department}</div>}
          </div>
        </Card>
        
        {node.children.length > 0 && (
          <div className="pl-5 border-l border-slate-200 ml-5 mt-2">
            {node.children.map(child => renderTreeView(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  if (!data) {
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
    <div className="overflow-auto max-h-[calc(100vh-250px)]">
      <div className="inline-block min-w-full p-4">
        {viewMode === 'orgChart' ? (
          <div className="flex justify-center">
            {renderOrgChart(chartData)}
          </div>
        ) : (
          <div className="space-y-2">
            {renderTreeView(chartData)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyVisualization;
