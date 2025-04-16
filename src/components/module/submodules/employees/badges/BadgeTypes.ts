
export interface BadgeData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  accessLevel: string;
  date: string;
  status: 'success' | 'warning' | 'error';
  statusText: string;
  company?: string;
}

export const generateBadgeNumber = () => {
  // Format: B1234
  return `B${Math.floor(1000 + Math.random() * 9000)}`;
};
