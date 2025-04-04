
export interface PaySlipDetail {
  name?: string;
  amount: number;
  type: "earning" | "deduction";
  base?: string;
  rate?: string;
  label: string;
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
  status: "draft" | "published" | "paid" | "Généré" | "Envoyé" | "Validé";
  pdfUrl?: string;
  department?: string;
  // Champs spécifiques pour la législation française
  hoursWorked?: number;
  employerName?: string;
  employerAddress?: string;
  employerSiret?: string;
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
