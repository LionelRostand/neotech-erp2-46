import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmployeeInitials, getAvatarColorFromName } from "../../utils/employeeUtils";
import { Employee } from '@/types/employee';
import { getPhotoUrl } from '../../utils/photoUtils';

interface TreeViewNodeProps {
  node: any;
  level?: number;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: any) => void;
  selectedNodeId?: string;
}

const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  node,
  level = 0,
  expanded,
  onToggleExpand,
  onSelectNode,
  selectedNodeId
}) => {
  const isExpanded = expanded.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const paddingLeft = 20 + (level * 10);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node.id);
  };

  const handleNodeClick = () => {
    onSelectNode(node);
  };

  return (
    <div className="py-1">
      <div
        className={cn(
          "flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer",
          selectedNodeId === node.id && "bg-secondary"
        )}
        style={{ paddingLeft: paddingLeft }}
        onClick={handleNodeClick}
      >
        <Avatar className="h-7 w-7">
          {node.photoURL || node.photo || getPhotoUrl(node.photoMeta) ? (
            <AvatarImage src={node.photoURL || node.photo || getPhotoUrl(node.photoMeta)} alt={node.firstName} />
          ) : (
            <AvatarFallback className={getAvatarColorFromName(node.firstName)}>
              {getEmployeeInitials(node)}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="text-sm font-medium leading-none">{node.firstName} {node.lastName}</span>
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="ml-auto h-8 w-8 p-0 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="pl-4">
          {node.children.map((child: any) => (
            <TreeViewNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeViewNode;
