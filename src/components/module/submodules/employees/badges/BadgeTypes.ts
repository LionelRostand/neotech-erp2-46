
import { Employee } from '@/types/employee';

export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department?: string;  // Keeping department as optional
  accessLevel: string;
  status: "success" | "warning" | "danger";
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
