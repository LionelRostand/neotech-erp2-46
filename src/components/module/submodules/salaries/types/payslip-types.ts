
export interface PaySlipData {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  taxes: number;
  contributions: number;
  bonuses?: number;
  deductions?: any[];
  earnings?: any[];
  overtimeHours?: number;
  overtimeRate?: number;
  companyName?: string;
  companyAddress?: string;
  createdAt?: any;
  updatedAt?: any;
  // Add employee object to match the expected structure
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
    role?: string;
    socialSecurityNumber?: string;
    startDate?: string;
  };
  month?: string;
  year?: number;
  status?: string;
}
