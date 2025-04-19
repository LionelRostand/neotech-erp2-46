
export interface Contract {
  id?: string;
  reference: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'expired' | 'pending' | 'terminated';
  salaryBase?: number;
  currency?: string;
  workHours?: number;
  description?: string;
  notes?: string;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
