
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
