import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getEmployeeInitials, getAvatarColorFromName, getPositionStyleClasses } from "../../utils/employeeUtils";
import { Employee } from '@/types/employee';
import { getPhotoUrl } from '../../utils/photoUtils';

interface OrgChartNodeProps {
  employee: Employee;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSelect?: (employee: Employee) => void;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({
  employee,
  children,
  isCollapsed = false,
  onToggleCollapse,
  onSelect
}) => {
  const avatarColor = getAvatarColorFromName(employee.firstName + employee.lastName);
  const positionClasses = getPositionStyleClasses(employee.position || '');
  const photoUrl = getPhotoUrl(employee.photoMeta);

  return (
    <div className="relative">
      <div className="flex items-center space-x-4 p-4 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect?.(employee)}>
        <Avatar className={`h-10 w-10 ${avatarColor}`}>
          {photoUrl ? (
            <AvatarImage src={photoUrl} alt={employee.firstName} />
          ) : (
            <AvatarFallback>{getEmployeeInitials(employee)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h4 className="text-sm font-medium">{employee.firstName} {employee.lastName}</h4>
          <p className={`text-xs ${positionClasses}`}>{employee.position || 'N/A'}</p>
          <Badge variant="secondary" className="mt-1">{employee.department}</Badge>
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
