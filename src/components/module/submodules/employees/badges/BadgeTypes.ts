export interface BadgeData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  accessLevel: string;
  date: string;
  status: 'success' | 'warning' | 'danger';
  statusText: string;
  company?: string;
  photoURL?: string;
}

export interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
  loading?: boolean;
}

export const generateBadgeNumber = () => {
  // Format: B1234
  return `B${Math.floor(1000 + Math.random() * 9000)}`;
};
