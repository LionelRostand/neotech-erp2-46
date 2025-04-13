
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartNode } from '../types';
import { getEmployeeInitials, getAvatarColorFromName, getPositionStyleClasses } from '../../utils/employeeUtils';

interface OrgChartNodeProps {
  node: ChartNode;
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

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ node, searchQuery }) => {
  if (!nodeMatchesSearch(node, searchQuery)) return null;
  
  const positionColor = getPositionStyleClasses(node.position);
  const avatarColor = getAvatarColorFromName(node.name);
  
  return (
    <div key={node.id} className="flex flex-col items-center">
      <Card className={`p-4 flex flex-col items-center w-56 text-center mb-2 shadow-md hover:shadow-lg transition-shadow border-2 ${positionColor}`}>
        <Avatar className="h-20 w-20 mb-2 ring-2 ring-white ring-offset-2 ring-offset-slate-50">
          {node.imageUrl ? (
            <AvatarImage src={node.imageUrl} alt={node.name} />
          ) : (
            <AvatarFallback className={avatarColor}>
              {getEmployeeInitials(node.name.split(' ')[0], node.name.split(' ')[1])}
            </AvatarFallback>
          )}
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
                <OrgChartNode node={child} searchQuery={searchQuery} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgChartNode;
