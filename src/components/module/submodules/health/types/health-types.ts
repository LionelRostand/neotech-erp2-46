
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  bloodType?: string;
  insuranceId?: string;
  medicalHistory?: string[];
  allergies?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  email?: string;
  phone?: string;
  department?: string;
  status: string;
  schedule?: {
    [key: string]: string[];
  };
  qualifications?: string[];
  licenseNumber?: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  status: string;
  schedule?: {
    [key: string]: string[];
  };
  startDate?: string;
  position?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
  duration?: number;
  room?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  notes: string;
  prescriptions?: string[];
  followUp?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes?: string;
  status: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  history: {
    date: string;
    type: string;
    description: string;
    doctorId: string;
  }[];
  allergies: string[];
  vaccinations: {
    name: string;
    date: string;
    nextDue?: string;
  }[];
  chronicConditions: string[];
}

export interface Admission {
  id: string;
  patientId: string;
  roomId: string;
  admissionDate: string;
  dischargeDate?: string;
  diagnosis: string;
  status: string;
  doctorId: string;
  notes?: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  occupied: number;
  status: string;
  floor: string;
  equipment?: string[];
}

export interface HealthBill {
  id: string;
  patientId: string;
  date: string;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
  total: number;
  status: string;
  insuranceCoverage?: number;
  paymentMethod?: string;
}

export interface Insurance {
  id: string;
  provider: string;
  policyNumber: string;
  patientId: string;
  coverage: {
    type: string;
    percentage: number;
    limit?: number;
  }[];
  validUntil: string;
  status: string;
}

export interface Laboratory {
  id: string;
  patientId: string;
  doctorId: string;
  testType: string;
  date: string;
  results?: any;
  status: string;
  notes?: string;
}

export interface HealthInventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumLevel: number;
  location?: string;
  supplier?: string;
  lastRestocked?: string;
  expiryDate?: string;
}

export interface HealthSettings {
  id: string;
  name: string;
  value: any;
  category: string;
  description?: string;
  lastUpdated: string;
}

export interface HealthPermission {
  id: string;
  role: string;
  resource: string;
  actions: string[];
  conditions?: any;
}
