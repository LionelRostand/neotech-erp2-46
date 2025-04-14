
// Basic employee interface
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  photoURL?: string;
  hireDate?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  status?: 'active' | 'inactive' | 'onLeave' | 'terminated';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  salary?: number;
  bankInfo?: {
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    iban?: string;
  };
  documents?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Department interface
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount?: number;
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Contract interface
export interface Contract {
  id: string;
  employeeId: string;
  employeeName?: string;
  type: 'permanent' | 'temporary' | 'internship' | 'freelance' | 'other';
  startDate: string;
  endDate?: string;
  salaryAmount: number;
  currency?: string;
  workingHours?: number;
  status: 'active' | 'pending' | 'terminated' | 'expired';
  terminationReason?: string;
  documents?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Leave request interface
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement' | 'other';
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Absence record
export interface Absence {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  type: 'unexcused' | 'excused' | 'late' | 'early-departure';
  duration?: number; // in minutes or hours
  reason?: string;
  notes?: string;
  status: 'recorded' | 'justified' | 'unjustified';
  createdAt?: string;
  updatedAt?: string;
}

// Employee evaluation
export interface Evaluation {
  id: string;
  employeeId: string;
  employeeName?: string;
  evaluatorId: string;
  evaluatorName?: string;
  date: string;
  period: {
    start: string;
    end: string;
  };
  performance: {
    productivity?: number;
    quality?: number;
    teamwork?: number;
    communication?: number;
    initiative?: number;
    leadership?: number;
    overall: number;
  };
  strengths?: string[];
  improvements?: string[];
  goals?: string[];
  comments?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'acknowledged';
  createdAt?: string;
  updatedAt?: string;
}

// Training record
export interface Training {
  id: string;
  title: string;
  description?: string;
  type: 'online' | 'classroom' | 'workshop' | 'seminar' | 'other';
  startDate: string;
  endDate?: string;
  duration?: number; // in hours
  provider?: string;
  location?: string;
  cost?: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'ongoing';
  participants?: {
    employeeId: string;
    employeeName?: string;
    status: 'registered' | 'completed' | 'no-show' | 'in-progress';
    grade?: string;
    feedback?: string;
  }[];
  materials?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Employee badge
export interface Badge {
  id: string;
  employeeId: string;
  employeeName?: string;
  badgeNumber: string;
  issueDate: string;
  expirationDate?: string;
  status: 'active' | 'expired' | 'revoked' | 'lost';
  accessLevels?: string[];
  photo?: string;
  lastAccess?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Salary record
export interface Salary {
  id: string;
  employeeId: string;
  employeeName?: string;
  amount: number;
  currency: string;
  effectiveDate: string;
  type: 'base' | 'raise' | 'bonus' | 'commission' | 'adjustment';
  reason?: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Payslip record
export interface Payslip {
  id: string;
  employeeId: string;
  employeeName?: string;
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
  salary: {
    base: number;
    overtime?: number;
    bonus?: number;
    commission?: number;
    other?: number;
    gross: number;
    deductions: {
      tax?: number;
      socialSecurity?: number;
      retirement?: number;
      health?: number;
      other?: number;
      total: number;
    };
    net: number;
  };
  status: 'draft' | 'final' | 'paid';
  paymentDate?: string;
  paymentMethod?: string;
  notes?: string;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// For the EmployeesProfiles component props
export interface EmployeesProfilesProps {
  employees: Employee[];
}
