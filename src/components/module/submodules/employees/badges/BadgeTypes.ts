
export interface BadgeData {
  id: string;
  employeeId: string;
  employeeName: string;
  badgeNumber: string;
  issueDate: string;
  expirationDate?: string;
  status: 'active' | 'expired' | 'revoked' | 'lost';
  accessLevels?: string[];
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  lastAccess?: string;
  notes?: string;
}

// Interface for the BadgesTable component props
export interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
  loading?: boolean;
}

// Interface for the CreateBadgeDialog component props
export interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

// Interface for BadgeStats
export interface BadgeStatsData {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

// Helper to get initials from names
export const getInitials = (firstName: string, lastName: string) => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

// Generate a unique badge number - make sure this is exported for CreateBadgeDialog
export const generateBadgeNumber = (): string => {
  return `B-${Math.floor(2460 + Math.random() * 100)}`;
};

// Add missing Employee import
import { Employee } from '@/types/employee';
