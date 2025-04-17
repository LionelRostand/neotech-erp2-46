
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getEmployeeInitials, getAvatarColorFromName, getPositionStyleClasses } from "../../utils/employeeUtils";
import { Employee } from '@/types/employee';
import { getPhotoUrl } from '../../utils/photoUtils';
import { ChartNode } from '../types';

interface OrgChartNodeProps {
  employee: Employee;
  node?: ChartNode | any;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSelect?: (employee: Employee) => void;
  searchQuery?: string;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({
  employee,
  node,
  children,
  isCollapsed = false,
  onToggleCollapse,
  onSelect,
  searchQuery = ''
}) => {
  // If node is provided, use it instead of employee directly
  const employeeData = node || employee;
  
  const avatarColor = getAvatarColorFromName(employeeData.firstName + employeeData.lastName);
  const positionClasses = getPositionStyleClasses(employeeData.position || '');
  const photoUrl = getPhotoUrl(employeeData.photoMeta);

  return (
    <div className="relative">
      <div className="flex items-center space-x-4 p-4 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect?.(employeeData)}>
        <Avatar className={`h-10 w-10 ${avatarColor}`}>
          {photoUrl ? (
            <AvatarImage src={photoUrl} alt={employeeData.firstName} />
          ) : (
            <AvatarFallback>{getEmployeeInitials(employeeData)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h4 className="text-sm font-medium">{employeeData.firstName} {employeeData.lastName}</h4>
          <p className={`text-xs ${positionClasses}`}>{employeeData.position || 'N/A'}</p>
          <Badge variant="secondary" className="mt-1">{employeeData.department}</Badge>
        </div>
      </div>

      {children && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 rounded-full h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse?.();
          }}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          <span className="sr-only">Toggle Collapse</span>
        </Button>
      )}

      {!isCollapsed && children && (
        <div className="mt-4 ml-6 pl-6 border-l-2 border-dashed border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default OrgChartNode;
