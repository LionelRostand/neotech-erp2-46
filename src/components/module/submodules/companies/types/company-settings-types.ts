
export interface CompanyPermission {
  id: string;
  name: string;
  description: string;
  value: boolean;
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface CompanyUserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  permissions: CompanyPermission[];
}
