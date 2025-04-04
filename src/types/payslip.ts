
export interface PaySlipEmployee {
  firstName: string;
  lastName: string;
  employeeId: string;
  role: string;
  socialSecurityNumber: string;
  startDate: string;
}

export interface PaySlipDetail {
  label: string;
  base: string;
  rate?: string;
  amount: number;
  type: "earning" | "deduction";
}

export interface PaySlip {
  id: string;
  employee: PaySlipEmployee;
  period: string;
  details: PaySlipDetail[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  hoursWorked: number;
  paymentDate: string;
  employerName: string;
  employerAddress: string;
  employerSiret: string;
  // Nouveaux champs pour la législation française
  conges?: {
    acquired: number;
    taken: number;
    balance: number;
  };
  rtt?: {
    acquired: number;
    taken: number;
    balance: number;
  };
  annualCumulative?: {
    grossSalary: number;
    netSalary: number;
    taxableIncome: number;
  };
}
