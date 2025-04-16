
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department?: string;
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
  // Generate a 4-digit number between 1000 and 9999
  const number = Math.floor(1000 + Math.random() * 9000);
  return `B${number}`;
};
