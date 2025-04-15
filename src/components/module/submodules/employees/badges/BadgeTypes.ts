export interface BadgeData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  company: string;
  accessLevel: string;
  date: string;
  status: 'success' | 'warning' | 'danger';
  statusText: string;
  photoURL?: string;
}

export interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
  loading?: boolean;
}

export const generateBadgeNumber = (): string => {
  return `B-${Math.floor(2460 + Math.random() * 100)}`;
};
