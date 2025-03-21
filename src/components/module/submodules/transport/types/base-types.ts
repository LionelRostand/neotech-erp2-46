
// Common shared transport types and interfaces

// Status types
export type TransportReservationStatus = 
  | "confirmed" 
  | "pending" 
  | "in-progress" 
  | "completed" 
  | "cancelled";

// Service types
export type TransportService = 
  | "airport-transfer" 
  | "city-tour" 
  | "business-travel" 
  | "wedding" 
  | "event" 
  | "hourly-hire" 
  | "long-distance" 
  | "custom";

// Common interfaces that might be reused
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}
