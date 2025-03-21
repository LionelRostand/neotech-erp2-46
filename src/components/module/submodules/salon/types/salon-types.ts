
// Salon Client Types
export interface SalonClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  address?: string;
  preferences?: string;
  notes?: string;
  preferredStylist?: string;
  loyaltyPoints: number;
  createdAt: string;
  lastVisit: string | null;
  visits: SalonVisit[];
  appointments: SalonAppointment[];
}

// Visit History
export interface SalonVisit {
  date: string;
  service: string;
  stylist: string;
  price: number;
  satisfaction?: 'Très satisfait' | 'Satisfait' | 'Insatisfait';
  notes?: string;
}

// Appointment
export interface SalonAppointment {
  id: string;
  clientId: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// Stylist
export interface SalonStylist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  schedule: SalonSchedule[];
  avatar?: string;
}

// Schedule
export interface SalonSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

// Service
export interface SalonService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
}

// Products
export interface SalonProduct {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
}
