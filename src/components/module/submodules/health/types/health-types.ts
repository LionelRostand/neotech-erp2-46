
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
}
