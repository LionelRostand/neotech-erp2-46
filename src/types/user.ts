
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // Additional properties being used across the application
  department?: string;
  position?: string;
  status?: 'active' | 'inactive' | 'pending';
  profileImageUrl?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define UserPermission interface that was missing
export interface UserPermission {
  userId: string;
  modules: {
    [key: string]: {
      read: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
      admin?: boolean;
    }
  }
}

// Update AuthContextType to include properties referenced in components
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Additional properties used in components
  isOffline?: boolean;
  currentUser?: any; // Used in some components 
  userData?: any; // Used in some components
  loading?: boolean; // Alias for isLoading used in some components
}
