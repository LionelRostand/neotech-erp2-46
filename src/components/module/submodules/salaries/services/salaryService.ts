
// Define interfaces
export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  monthName: string;
  year: number;
  date: string;
  grossSalary: number;
  netSalary: number;
  status: 'Généré' | 'Envoyé' | 'Validé';
}

export interface PaySlipData {
  id?: string;
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  deductions: any[];
  earnings: any[];
  date?: string;
}

// Mock data
const mockPayslips: Payslip[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'Jean Dupont',
    month: '04',
    monthName: 'Avril',
    year: 2025,
    date: new Date().toISOString(),
    grossSalary: 3500,
    netSalary: 2750,
    status: 'Généré'
  },
  {
    id: '2',
    employeeId: 'emp2',
    employeeName: 'Marie Laurent',
    month: '03',
    monthName: 'Mars',
    year: 2025,
    date: new Date().toISOString(),
    grossSalary: 4200,
    netSalary: 3300,
    status: 'Envoyé'
  }
];

// Service methods
export const getAllPayslips = async (): Promise<Payslip[]> => {
  console.log('Getting all payslips');
  
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockPayslips);
    }, 500);
  });
};

export const getEmployeePaySlips = async (employeeId: string): Promise<Payslip[]> => {
  console.log(`Getting payslips for employee ${employeeId}`);
  
  // Filter by employee ID
  const filtered = mockPayslips.filter(p => p.employeeId === employeeId);
  
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(filtered);
    }, 500);
  });
};

export const savePaySlip = async (data: PaySlipData): Promise<{ id: string }> => {
  console.log('Saving payslip', data);
  
  // Generate ID if not provided
  const id = data.id || `payslip_${Date.now()}`;
  
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id });
    }, 500);
  });
};

export const updatePaySlip = async (id: string, data: Partial<PaySlipData>): Promise<{ id: string }> => {
  console.log(`Updating payslip ${id}`, data);
  
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id });
    }, 500);
  });
};

export const deletePayslip = async (id: string): Promise<boolean> => {
  console.log(`Deleting payslip ${id}`);
  
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
