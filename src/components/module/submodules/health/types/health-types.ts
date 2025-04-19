export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: 'Male' | 'Female' | 'Other';
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  medicalConditions?: string[];
  allergies?: string[];
  insurance?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  lastVisit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id?: string;
  firstName: string;
  lastName: string;
  specialty: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  qualifications?: string[];
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Checkup' | 'FollowUp';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Consultation {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Prescription {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecord {
  id?: string;
  patientId: string;
  date: string;
  type: 'LabTest' | 'Radiology' | 'Procedure' | 'ConsultationNote';
  description: string;
  results?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id?: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  qualifications?: string[];
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Nurse {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  qualifications?: string[];
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Insurance {
  id?: string;
  name: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id?: string;
  patientId: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Inventory {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category: string;
  supplier?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id?: string;
  roomNumber: string;
  type: 'Single' | 'Double' | 'Suite';
  floor: number;
  bedsTotal: number;
  bedsAvailable: number;
  isAvailable: boolean;
  currentPatientId?: string | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
