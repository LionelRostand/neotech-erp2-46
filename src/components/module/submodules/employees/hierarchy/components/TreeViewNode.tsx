
import React from 'react';
import { ChevronRight, ChevronDown, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChartNode } from '../types/hierarchy-types';

interface TreeViewNodeProps {
  node: ChartNode;
  expanded: boolean;
  searchQuery: string;
  children?: React.ReactNode;
  onToggleExpand: () => void;
  onSelectNode: () => void;
  depth?: number;
}

const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  node,
  expanded,
  searchQuery,
  children,
  onToggleExpand,
  onSelectNode,
  depth = 0,
}) => {
  // Vérifier si le nœud correspond à la recherche
  const matchesSearch = searchQuery
    ? node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.department && node.department.toLowerCase().includes(searchQuery.toLowerCase()))
    : true;

  // Si le nœud ne correspond pas à la recherche et qu'il n'a pas d'enfants qui correspondent,
  // ne pas l'afficher
  if (searchQuery && !matchesSearch && !React.Children.count(children)) {
    return null;
  }

  // Indentation basée sur la profondeur
  const indentStyle = {
    paddingLeft: `${depth * 20}px`,
  };

  return (
    <div className={`mb-1 ${matchesSearch ? 'opacity-100' : 'opacity-70'}`}>
      <div 
        className={`flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors ${
          matchesSearch && searchQuery ? 'bg-blue-50' : ''
        }`} 
        style={indentStyle}
      >
        {React.Children.count(children) > 0 ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 mr-1" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-7 h-6"></div>
        )}
        
        <div 
          className="flex items-center flex-grow cursor-pointer"
          onClick={onSelectNode}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={node.imageUrl} />
            <AvatarFallback>{getInitials(node.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{node.name}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{node.position}</span>
              {node.department && (
                <>
                  <span className="mx-1">•</span>
                  <span>{node.department}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {expanded && children && (
        <div className="ml-2 children-container">
          {children}
        </div>
      )}
    </div>
  );
};

export default TreeViewNode;
