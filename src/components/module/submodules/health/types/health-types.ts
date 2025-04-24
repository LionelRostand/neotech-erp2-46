
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  email?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string[];
  medicalConditions?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  availability?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Nurse {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  department?: string;
  shift?: 'morning' | 'afternoon' | 'night';
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'followup' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  chiefComplaint: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUp?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  patientName?: string; // For display purposes
  doctorName?: string; // For display purposes
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LaboratoryTest {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  testType: string;
  status: 'ordered' | 'in-progress' | 'completed' | 'cancelled';
  results?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
    notes?: string;
  }[];
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  expiryDate?: string;
  manufacturer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'standard' | 'private' | 'icu' | 'operating' | 'emergency';
  capacity: number;
  occupied: number;
  floor: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hospitalization {
  id: string;
  patientId: string;
  doctorId: string;
  roomId: string;
  roomNumber?: string;
  admissionDate: string;
  dischargeDate?: string;
  reason: string;
  status: 'admitted' | 'discharged' | 'transferred';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  insuranceProvider: string;
  policyNumber: string;
  date: string;
  amount: number;
  serviceDescription: string;
  status: 'submitted' | 'in-review' | 'approved' | 'denied' | 'paid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingRecord {
  id: string;
  patientId: string;
  date: string;
  dueDate: string;
  services: {
    description: string;
    amount: number;
  }[];
  total: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'transfer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Schema for forms
export interface PatientFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  email?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string[];
  medicalConditions?: string[];
}

export interface AppointmentFormValues {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration?: number;
  type: 'consultation' | 'followup' | 'emergency';
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface ConsultationFormValues {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  chiefComplaint: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUp?: string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
