export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  email?: string;
  insuranceId?: string;
  bloodType?: string;
  allergens?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  speciality: string;
  phone?: string;
  email?: string;
  available: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LabTest {
  id: string;
  patientId: string;
  doctorId: string;
  type: string;
  requestedDate: Date | string;
  scheduledDate?: Date | string;
  completedDate?: Date | string;
  results?: string;
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date | string;
  diagnosis: string;
  treatment?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  digitallySignedBy?: string;
  signatureDate?: Date | string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date | string;
  chiefComplaint: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  prescriptionIds?: string[];
  labTestIds?: string[];
  followUp?: Date | string;
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date | string;
  updatedAt: Date | string;
  vitalSigns?: VitalSigns;
  medicalImages?: MedicalImage[];
  physicalExam?: string;
  assessment?: string;
  plan?: string;
  medicalHistory?: string;
}

export interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  pain?: number;
}

export interface MedicalImage {
  id: string;
  type: 'xray' | 'mri' | 'ct' | 'ultrasound' | 'other';
  date: Date | string;
  url: string;
  description?: string;
  bodyPart?: string;
  findings?: string;
  requestedBy: string;
  technician?: string;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  department?: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date | string;
  dateHired: Date | string;
  status: 'active' | 'on-leave' | 'terminated';
  permissions: string[];
  specialization?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  schedule?: WorkSchedule[];
  absences?: Absence[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type StaffRole = 'doctor' | 'nurse' | 'secretary' | 'technician' | 'director' | 'pharmacist' | 'lab_technician';

export interface WorkSchedule {
  id: string;
  staffId: string;
  startDate: Date | string;
  endDate: Date | string;
  shifts: Shift[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Shift {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isOnCall: boolean;
}

export interface Absence {
  id: string;
  staffId: string;
  startDate: Date | string;
  endDate: Date | string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  approvedBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date | string;
  medications: Medication[];
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  isDigitallySigned: boolean;
  signedBy?: string;
  signatureDate?: Date | string;
  sentToPharmacy?: boolean;
  pharmacyId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: number;
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  type: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'other';
  dosage: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: Date | string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  location?: string;
  needsPrescription: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PharmacySale {
  id: string;
  date: Date | string;
  patientId?: string;
  prescriptionId?: string;
  items: {
    medicationId: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'other';
  staffId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PharmacyRestock {
  id: string;
  date: Date | string;
  supplier: string;
  invoiceNumber: string;
  items: {
    medicationId: string;
    quantity: number;
    unitPrice: number;
    batchNumber: string;
    expiryDate: Date | string;
  }[];
  totalAmount: number;
  receivedBy: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Insurance {
  id: string;
  name: string;
  type: 'public' | 'private' | 'mutual';
  coverageLevel: 'basic' | 'advanced' | 'premium';
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  coverageDetails: {
    consultations: number;
    medications: number;
    hospitalization: number;
    specialistVisits: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  insuranceId: string;
  amount: number;
  date: string;
  description?: string;
  documents?: string[];
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  responseDate?: string;
  responseDetails?: string;
  reimbursedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PatientInsurance {
  id: string;
  patientId: string;
  insuranceId: string;
  policyNumber: string;
  startDate: string;
  endDate?: string;
  isPrimary: boolean;
  additionalDetails?: {
    beneficiaryNumber?: string;
    groupNumber?: string;
    employerName?: string;
  };
  createdAt: string;
  updatedAt: string;
}
