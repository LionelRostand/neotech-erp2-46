
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
  createdAt?: any;
  updatedAt?: any;
}
