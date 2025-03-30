
import { TransportService } from './base-types';

// Individual permission for a specific module
export interface TransportPermission {
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Permissions for a user
export interface TransportUserPermission {
  userId: string;
  permissions: TransportPermission[];
}

export interface UserWithPermissions {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: TransportPermission[];
}
