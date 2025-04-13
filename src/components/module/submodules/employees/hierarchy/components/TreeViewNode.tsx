
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartNode } from '../types';
import { getEmployeeInitials, getAvatarColorFromName } from '../../utils/employeeUtils';

interface TreeViewNodeProps {
  node: ChartNode;
  level?: number;
  searchQuery: string;
}

// Helper function to check if a node or its children match the search query
const nodeMatchesSearch = (node: ChartNode, query: string): boolean => {
  if (!query.trim()) return true;
  
  const searchLower = query.toLowerCase();
  const nodeName = node.name.toLowerCase();
  const nodePosition = node.position.toLowerCase();
  const nodeDepartment = node.department ? node.department.toLowerCase() : '';
  
  if (
    nodeName.includes(searchLower) ||
    nodePosition.includes(searchLower) ||
    nodeDepartment.includes(searchLower)
  ) {
    return true;
  }
  
  // Check children
  return node.children.some(child => nodeMatchesSearch(child, searchLower));
};

const TreeViewNode: React.FC<TreeViewNodeProps> = ({ node, level = 0, searchQuery }) => {
  if (!nodeMatchesSearch(node, searchQuery)) return null;
  
  const avatarColor = getAvatarColorFromName(node.name);
  const isManager = node.position.toLowerCase().includes('manager') || 
                    node.position.toLowerCase().includes('directeur') || 
                    node.position.toLowerCase().includes('chef') ||
                    node.position.toLowerCase().includes('responsable');
  
  return (
    <div key={node.id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
      <Card className={`p-3 flex items-center hover:bg-slate-50 transition-colors border-l-4 ${isManager ? 'border-l-blue-500' : 'border-l-slate-200'}`}>
        <Avatar className="h-10 w-10 mr-3">
          {node.imageUrl ? (
            <AvatarImage src={node.imageUrl} alt={node.name} />
          ) : (
            <AvatarFallback className={avatarColor}>
              {getEmployeeInitials(node.name.split(' ')[0], node.name.split(' ')[1])}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <div className="font-medium">{node.name}</div>
          <div className="text-sm text-slate-500">{node.position}</div>
          {node.department && <div className="text-xs text-slate-400">{node.department}</div>}
        </div>
      </Card>
      
      {node.children.length > 0 && (
        <div className="pl-5 border-l border-slate-200 ml-5 mt-2">
          {node.children.map(child => (
            <TreeViewNode 
              key={child.id}
              node={child} 
              level={level + 1} 
              searchQuery={searchQuery} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeViewNode;
