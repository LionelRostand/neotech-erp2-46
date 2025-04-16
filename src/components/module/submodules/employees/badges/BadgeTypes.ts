
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  company?: string;
  accessLevel: string;
  status: 'success' | 'warning' | 'danger' | string;
  statusText: string;
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
  employees?: any[];
}

export const getInitials = (firstName: string, lastName: string) => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

export const generateBadgeNumber = (): string => {
  // Generate a shorter, more memorizable badge number
  const prefix = 'B';
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit number between 1000-9999
  return `${prefix}${randomDigits}`;
};
