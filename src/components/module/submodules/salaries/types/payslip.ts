
export interface PaySlipDetail {
  name: string;
  amount: number;
  type: "earning" | "deduction";
}

export interface PaySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  details: PaySlipDetail[];
  grossSalary: number;
  netSalary: number;
  totalDeductions: number;
  date: string;
  status: "draft" | "published" | "paid";
}
