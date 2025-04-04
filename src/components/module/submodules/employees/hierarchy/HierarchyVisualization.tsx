
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, User } from 'lucide-react';

export interface ChartNode {
  id: string;
  name: string;
  position: string;
  department: string;
  imageUrl?: string;
  children: ChartNode[];
}

interface HierarchyVisualizationProps {
  data: ChartNode;
  viewMode: 'orgChart' | 'treeView';
  searchQuery: string;
}

export const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data, 
  viewMode,
  searchQuery 
}) => {
  return (
    <div className="w-full overflow-auto">
      {viewMode === 'orgChart' ? (
        <OrganizationChart node={data} searchQuery={searchQuery} />
      ) : (
        <TreeView node={data} searchQuery={searchQuery} />
      )}
    </div>
  );
};

// Organization Chart Component (top-down visualization)
export const OrganizationChart: React.FC<{ node: ChartNode; searchQuery: string }> = ({ node, searchQuery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filteredNode, setFilteredNode] = useState<ChartNode | null>(node);
  
  // Filter the tree based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredNode(node);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filterNode = (n: ChartNode): ChartNode | null => {
      // Check if current node matches
      const nodeMatches = n.name.toLowerCase().includes(query) || 
                          n.position.toLowerCase().includes(query) ||
                          n.department.toLowerCase().includes(query);
      
      // Filter children
      const filteredChildren = n.children
        .map(filterNode)
        .filter((child): child is ChartNode => child !== null);
      
      // Return node if it matches or has matching children
      if (nodeMatches || filteredChildren.length > 0) {
        return {
          ...n,
          children: filteredChildren
        };
      }
      
      return null;
    };
    
    setFilteredNode(filterNode(node));
  }, [node, searchQuery]);
  
  if (!filteredNode) {
    return <div className="text-center py-8">Aucun résultat trouvé pour "{searchQuery}"</div>;
  }
  
  return (
    <div className="flex flex-col items-center w-full overflow-auto p-4" ref={containerRef}>
      <div className="org-chart">
        <NodeCard node={filteredNode} isRoot={true} />
        
        {filteredNode.children.length > 0 && (
          <>
            <div className="connector-line-down"></div>
            
            <div className="children-container">
              {filteredNode.children.map((child, index) => (
                <div key={child.id} className="child-branch">
                  <div className="connector-line-up"></div>
                  <SubTree node={child} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        .org-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: max-content;
        }
        
        .connector-line-down {
          width: 2px;
          height: 20px;
          background-color: #d1d5db;
        }
        
        .connector-line-up {
          width: 2px;
          height: 20px;
          background-color: #d1d5db;
          margin: 0 auto;
        }
        
        .children-container {
          display: flex;
          justify-content: center;
          gap: 40px;
        }
        
        .child-branch {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

// Recursive component for sub-trees in the org chart
const SubTree: React.FC<{ node: ChartNode }> = ({ node }) => {
  return (
    <div className="subtree">
      <NodeCard node={node} isRoot={false} />
      
      {node.children.length > 0 && (
        <>
          <div className="connector-line-down"></div>
          
          <div className="children-container">
            {node.children.map((child) => (
              <div key={child.id} className="child-branch">
                <div className="connector-line-up"></div>
                <SubTree node={child} />
              </div>
            ))}
          </div>
        </>
      )}
      
      <style jsx>{`
        .subtree {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .connector-line-down {
          width: 2px;
          height: 20px;
          background-color: #d1d5db;
        }
        
        .connector-line-up {
          width: 2px;
          height: 20px;
          background-color: #d1d5db;
        }
        
        .children-container {
          display: flex;
          justify-content: center;
          gap: 40px;
        }
        
        .child-branch {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

// Node Card Component
const NodeCard: React.FC<{ node: ChartNode; isRoot: boolean }> = ({ node, isRoot }) => {
  return (
    <Card className={`p-3 min-w-[220px] ${isRoot ? 'border-blue-500 shadow-lg' : ''}`}>
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-16 w-16 mb-2">
          {node.imageUrl ? (
            <AvatarImage src={node.imageUrl} alt={node.name} />
          ) : (
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
        <h4 className="font-bold text-sm">{node.name}</h4>
        <p className="text-xs text-gray-500">{node.position}</p>
        <Badge variant="outline" className="mt-1 text-xs">
          {node.department}
        </Badge>
      </div>
    </Card>
  );
};

// Tree View Component (expandable/collapsible tree)
export const TreeView: React.FC<{ node: ChartNode; searchQuery: string }> = ({ node, searchQuery }) => {
  const [filteredNode, setFilteredNode] = useState<ChartNode | null>(node);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredNode(node);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filterNode = (n: ChartNode): ChartNode | null => {
      // Check if current node matches
      const nodeMatches = n.name.toLowerCase().includes(query) || 
                          n.position.toLowerCase().includes(query) ||
                          n.department.toLowerCase().includes(query);
      
      // Filter children
      const filteredChildren = n.children
        .map(filterNode)
        .filter((child): child is ChartNode => child !== null);
      
      // Return node if it matches or has matching children
      if (nodeMatches || filteredChildren.length > 0) {
        return {
          ...n,
          children: filteredChildren
        };
      }
      
      return null;
    };
    
    setFilteredNode(filterNode(node));
  }, [node, searchQuery]);

  if (!filteredNode) {
    return <div className="text-center py-8">Aucun résultat trouvé pour "{searchQuery}"</div>;
  }

  return (
    <div className="pl-4 w-full">
      <TreeNode node={filteredNode} level={0} defaultExpanded={true} />
    </div>
  );
};

// Tree Node Component
const TreeNode: React.FC<{ 
  node: ChartNode; 
  level: number;
  defaultExpanded?: boolean;
}> = ({ node, level, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || level < 2);
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="mb-1">
      <div className={`flex items-center py-1 ${level === 0 ? 'bg-blue-50 p-2 rounded' : ''}`}>
        <div style={{ width: `${level * 12}px` }} />
        
        {hasChildren ? (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="mr-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-5 mr-1" />
        )}
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {node.imageUrl ? (
              <AvatarImage src={node.imageUrl} alt={node.name} />
            ) : (
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <p className="font-medium text-sm">{node.name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">{node.position}</p>
              <Badge variant="outline" className="text-xs">
                {node.department}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="ml-4">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
