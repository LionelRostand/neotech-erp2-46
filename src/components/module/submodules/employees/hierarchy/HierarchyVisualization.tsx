
import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Users } from 'lucide-react';
import { ChartNode } from './types';

interface HierarchyVisualizationProps {
  data: ChartNode | null;
  viewMode: 'orgChart' | 'treeView';
  searchQuery: string;
}

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data, 
  viewMode, 
  searchQuery 
}) => {
  // Helper function to check if a node or its children match the search query
  const nodeMatchesSearch = (node: ChartNode, query: string): boolean => {
    if (!query.trim()) return true;
    
    const searchLower = query.toLowerCase();
    if (
      node.name.toLowerCase().includes(searchLower) ||
      node.position.toLowerCase().includes(searchLower) ||
      (node.department && node.department.toLowerCase().includes(searchLower))
    ) {
      return true;
    }
    
    // Check children
    return node.children.some(child => nodeMatchesSearch(child, query));
  };
  
  // OrgChart view rendering
  const renderOrgChart = (node: ChartNode) => {
    if (!nodeMatchesSearch(node, searchQuery)) return null;
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <Card className="p-4 flex flex-col items-center w-56 text-center mb-2">
          {node.imageUrl ? (
            <img 
              src={node.imageUrl} 
              alt={node.name} 
              className="w-16 h-16 rounded-full mb-2 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
              <User className="h-8 w-8 text-slate-500" />
            </div>
          )}
          <div className="font-medium">{node.name}</div>
          <div className="text-sm text-slate-500">{node.position}</div>
          {node.department && <div className="text-xs text-slate-400">{node.department}</div>}
        </Card>
        
        {node.children.length > 0 && (
          <div className="relative pt-6">
            <div className="absolute top-0 left-1/2 h-6 w-0.5 -ml-px bg-slate-300"></div>
            <div className="flex space-x-10">
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
          {node.imageUrl ? (
            <img 
              src={node.imageUrl} 
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
            {renderOrgChart(data)}
          </div>
        ) : (
          <div className="space-y-2">
            {renderTreeView(data)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyVisualization;
