
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
  base?: string;
  rate?: string;
  amount: number;
  type: "earning" | "deduction";
  name?: string;
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
  // Champs spécifiques pour la législation française
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
  status?: "draft" | "published" | "paid" | "Généré" | "Envoyé" | "Validé";
  date?: string;
  employeeId?: string;
  employeeName?: string;
  month?: string;
  year?: number;
  
  // Adding the missing properties
  paymentMethod?: string;
  notes?: string;
  
  // Adding properties for the PayslipList component
  currency?: string;
  netAmount?: number;
  grossAmount?: number;
  
  // Adding the fileData property for document storage
  fileData?: string | null;
  pdfUrl?: string;
}
