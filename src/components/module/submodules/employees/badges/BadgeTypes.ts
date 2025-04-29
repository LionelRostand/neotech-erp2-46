
import { Employee } from '@/types/employee';

// Interface for Badge data
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  accessLevel: string;
  status: "success" | "warning" | "danger";
  statusText: string;
  company?: string;
}

export interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
  loading?: boolean;
}

export interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

export interface BadgeStatsData {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

export const getInitials = (firstName: string, lastName: string) => {
  if (!firstName && !lastName) return 'ID';
  return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || 'ID';
};

export const generateBadgeNumber = (): string => {
  // Format: B-YYMMDD-XXXX where XXXX is a random number between 1000-9999
  const now = new Date();
  const year = now.getFullYear().toString().substring(2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `B-${year}${month}${day}-${random}`;
};
