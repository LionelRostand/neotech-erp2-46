
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';
import { getInitials } from '@/lib/utils';

interface EmployeeProfileHeaderProps {
  employee: Employee | null;
  onClose?: () => void;
  onEmployeeUpdate?: () => void;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  onClose,
  onEmployeeUpdate
}) => {
  if (!employee) {
    return (
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="skeleton w-12 h-12 rounded-full"></div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-40"></div>
            <div className="skeleton h-3 w-24"></div>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Safely get employee data with fallbacks
  const photoUrl = employee?.photoURL || employee?.photo || '';
  const firstName = employee?.firstName || '';
  const lastName = employee?.lastName || '';
  const position = employee?.position || employee?.role || 'Employé';
  const status = employee?.status || 'active';

  // Get employee initials for avatar fallback
  const initials = getInitials(firstName, lastName);

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={photoUrl} alt={`${firstName} ${lastName}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <Badge
              variant={status === 'active' ? 'default' : 'outline'}
              className="bg-green-500 hover:bg-green-600"
            >
              {status === 'active' ? 'actif' : status}
            </Badge>
            <span className="text-sm text-gray-500">{position}</span>
          </div>
        </div>
      </div>
      
      {onClose && (
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EmployeeProfileHeader;
