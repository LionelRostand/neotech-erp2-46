
export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  createdAt?: any;
  updatedAt?: any;
  phoneNumber?: string;
  department?: string;
  position?: string;
  profileImageUrl?: string;
  status?: 'active' | 'inactive' | 'pending';
  lastLogin?: any;
}

export interface UserPermission {
  id?: string;
  userId: string;
  modules: {
    [key: string]: {
      read: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
      [key: string]: boolean;
    };
  };
}
