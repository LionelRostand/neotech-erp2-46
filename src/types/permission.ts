
// Types pour la gestion des permissions

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export?: boolean;
  admin?: boolean;
}

export interface UserPermissions {
  userId: string;
  permissions: {
    [moduleId: string]: ModulePermission;
  };
  isAdmin?: boolean;
}

export interface PermissionAction {
  resourceId: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'export';
  allowed: boolean;
}

export type PermissionLevel = 'none' | 'read' | 'write' | 'full' | 'admin';

export interface PermissionSettings {
  moduleId: string;
  roles: {
    [roleId: string]: PermissionLevel;
  }
}
