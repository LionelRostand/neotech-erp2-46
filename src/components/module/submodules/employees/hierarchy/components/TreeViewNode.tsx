
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getEmployeeInitials, getAvatarColorFromName, getPositionStyleClasses } from "../../utils/employeeUtils";
import { Employee } from '@/types/employee';
import { getPhotoUrl } from '../../utils/photoUtils';
import { ChartNode } from '../types';

interface TreeViewNodeProps {
  employee: Employee;
  node?: ChartNode | any;
  expanded: boolean;
  onToggleExpand: () => void;
  onSelectNode: (employee: Employee) => void;
  children?: React.ReactNode;
  searchQuery?: string;
}

const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  employee,
  node,
  expanded,
  onToggleExpand,
  onSelectNode,
  children,
  searchQuery = ''
}) => {
  // If node is provided, use it instead of employee directly
  const employeeData = node || employee;
  
  const avatarColor = getAvatarColorFromName(employeeData.firstName + employeeData.lastName);
  const positionClasses = getPositionStyleClasses(employeeData.position || '');
  const photoUrl = getPhotoUrl(employeeData.photoMeta);

  // Highlight if this node matches the search query
  const isHighlighted = searchQuery && (
    employeeData.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employeeData.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employeeData.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-2">
      <div 
        className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${isHighlighted ? 'bg-yellow-50 border border-yellow-200' : ''}`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 mr-2"
          onClick={onToggleExpand}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle</span>
        </Button>
        
        <div 
          className="flex items-center flex-grow cursor-pointer"
          onClick={() => onSelectNode(employeeData)}
        >
          <Avatar className={`h-8 w-8 mr-2 ${avatarColor}`}>
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt={employeeData.firstName} />
            ) : (
              <AvatarFallback>{getEmployeeInitials(employeeData)}</AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <div className="text-sm font-medium">{employeeData.firstName} {employeeData.lastName}</div>
            <div className={`text-xs ${positionClasses}`}>{employeeData.position || 'N/A'}</div>
          </div>
          
          <Badge variant="outline" className="ml-auto">
            {employeeData.department || 'No Department'}
          </Badge>
        </div>
      </div>
      
      {expanded && children && (
        <div className="ml-6 pl-2 border-l border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default TreeViewNode;
