
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
