
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  accessLevel: string;
  status: string;
  statusText: string;
  companyId: string;
  companyName: string;
  employeePhoto?: string;
  employeeShortId?: string;
}

export const generateBadgeNumber = (): string => {
  const prefix = 'BDG';
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${random}`;
};
