
import { TransportService } from './base-types';

export interface WebsiteIntegration {
  id: string;
  websiteModuleId: string;
  pageId?: string;
  sectionId?: string;
  status: 'active' | 'inactive' | 'pending';
  formConfig: WebBookingFormConfig;
  designConfig: WebBookingDesignConfig;
  lastUpdated: string;
  createdAt: string;
}

export interface WebBookingFormConfig {
  enableDriverSelection: boolean;
  requireUserAccount: boolean;
  enablePaymentOnline: boolean;
  defaultService: string;
  requirePhoneNumber: boolean;
  advanceBookingHours: number;
  maxBookingDaysInFuture: number;
  displayPricing: boolean;
  availableServices: string[];
  customFields?: WebBookingCustomField[];
}

export interface WebBookingCustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'number' | 'date' | 'time';
  required: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: string;
}

export interface WebBookingDesignConfig {
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  customCSS?: string;
  logo?: string;
  formWidth: 'narrow' | 'medium' | 'wide' | 'full';
}

export const defaultFormConfig: WebBookingFormConfig = {
  enableDriverSelection: true,
  requireUserAccount: false,
  enablePaymentOnline: true,
  defaultService: 'airport',
  requirePhoneNumber: true,
  advanceBookingHours: 3,
  maxBookingDaysInFuture: 30,
  displayPricing: true,
  availableServices: ['airport', 'hourly', 'pointToPoint', 'dayTour'],
};

export const defaultDesignConfig: WebBookingDesignConfig = {
  colorScheme: 'light',
  primaryColor: '#3b82f6',
  secondaryColor: '#6b7280',
  fontFamily: 'sans-serif',
  borderRadius: 'medium',
  formWidth: 'medium',
};
