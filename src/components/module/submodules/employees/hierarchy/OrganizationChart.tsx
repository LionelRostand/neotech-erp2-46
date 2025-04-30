
import React, { useState } from 'react';
import { OrgChartNode } from './types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrganizationChartProps {
  data: OrgChartNode;
}

export const OrganizationChart: React.FC<OrganizationChartProps> = ({ data }) => {
  return (
    <div className="w-full overflow-auto pb-10">
      <div className="min-w-max">
        <NodeComponent node={data} level={0} />
      </div>
    </div>
  );
};

interface NodeComponentProps {
  node: OrgChartNode;
  level: number;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node, level }) => {
  const [isCollapsed, setIsCollapsed] = useState(level > 1);
  
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="flex flex-col items-center">
      <Card className="w-64 p-4 flex flex-col items-center shadow-md">
        <Avatar className="w-20 h-20 mb-3 border-2 border-primary">
          {node.photo ? (
            <AvatarImage src={node.photo} alt={node.name} />
          ) : (
            <AvatarFallback className="text-lg">
              {node.name.split(' ').map(part => part[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="font-bold text-base text-center">{node.name}</h3>
        <p className="text-sm text-muted-foreground text-center">{node.title}</p>
        
        {node.department && (
          <div className="bg-primary/10 px-2 py-0.5 rounded text-xs mt-2">
            {node.department}
          </div>
        )}
        
        {hasChildren && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2" 
            onClick={handleToggle}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {node.children.length} {node.children.length > 1 ? 'subordonnés' : 'subordonné'}
          </Button>
        )}
      </Card>
      
      {hasChildren && !isCollapsed && (
        <div className="mt-4">
          <div className="h-8 w-px bg-gray-300"></div>
          
          <div className="flex items-start">
            {node.children.map((child, index) => (
              <div key={child.id} className="flex flex-col items-center mx-2">
                {index > 0 && index < node.children.length && (
                  <div className="w-full h-px bg-gray-300 mb-4"></div>
                )}
                <NodeComponent node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
