
// Base types used across transport module

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export type TransportService = 
  | 'airport'
  | 'hourly'
  | 'pointToPoint'
  | 'dayTour'
  | string; // Adding string for backward compatibility

export interface TransportBasic {
  id: string;
  createdAt?: string; // Making optional to fix the errors
  updatedAt?: string;
  notes?: any[];
}
