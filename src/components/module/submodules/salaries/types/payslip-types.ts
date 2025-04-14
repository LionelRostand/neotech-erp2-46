
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
}
