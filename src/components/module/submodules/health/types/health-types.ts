
// Base Type with common fields
export interface BaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient extends BaseEntity {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  bloodType?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  insuranceId?: string;
  medicalHistory?: string[];
  allergies?: string[];
  status?: 'active' | 'inactive';
}

export interface Doctor extends BaseEntity {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  specialty?: string;
  licenseNumber?: string;
  department?: string;
  availability?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  status?: 'active' | 'inactive' | 'on-leave';
}

export interface Consultation extends BaseEntity {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  consultationType: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  prescriptionIds?: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  chiefComplaint?: string;
  symptoms?: string[];
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    pain?: number;
  };
  followUp?: string;
  physicalExam?: string;
  assessment?: string;
  plan?: string;
  medicalHistory?: string;
}

export interface Appointment extends BaseEntity {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Prescription extends BaseEntity {
  patientId: string;
  doctorId: string;
  consultationId?: string;
  date: string;
  medications: Medication[];
  instructions?: string;
  status: 'active' | 'completed' | 'cancelled';
  refills?: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface MedicalRecord extends BaseEntity {
  patientId: string;
  consultations: string[]; // IDs of consultations
  prescriptions: string[]; // IDs of prescriptions
  documents: string[]; // IDs or paths to documents
  notes?: string;
  medicalHistory?: string[];
}

export interface Staff extends BaseEntity {
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface Invoice extends BaseEntity {
  patientId: string;
  consultationId?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Insurance extends BaseEntity {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  coverageDetails?: string;
  status: 'active' | 'inactive';
}

export interface LabTest extends BaseEntity {
  patientId: string;
  doctorId: string;
  date: string;
  testType: string;
  results?: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Laboratory extends BaseEntity {
  patientId: string;
  doctorId: string;
  date: string;
  testType: string;
  results?: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Inventory extends BaseEntity {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier?: string;
  expiryDate?: string;
  reorderLevel?: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface HealthSettings extends BaseEntity {
  clinicName: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  taxRate?: number;
  logo?: string;
  currency?: string;
  language?: string;
}

export interface HealthPermission extends BaseEntity {
  userId: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'accountant' | 'lab-technician';
  modules: {
    patients?: boolean;
    appointments?: boolean;
    consultations?: boolean;
    prescriptions?: boolean;
    medicalRecords?: boolean;
    laboratory?: boolean;
    billing?: boolean;
    inventory?: boolean;
    reports?: boolean;
    settings?: boolean;
  };
}
