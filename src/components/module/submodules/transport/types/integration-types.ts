
// Définition des types d'intégration pour le module transport

export interface WebsiteIntegration {
  id: string;
  name?: string;
  moduleId: string;
  pageId: string;
  type: 'iframe' | 'javascript' | 'api';
  status: 'active' | 'inactive' | 'pending';
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  allowedOrigins?: string[];
  customizationOptions?: Record<string, any>;
}

export interface WebBookingFormConfig {
  showHeader: boolean;
  showLogo: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fields: {
    name: {
      required: boolean;
      visible: boolean;
    };
    email: {
      required: boolean;
      visible: boolean;
    };
    phone: {
      required: boolean;
      visible: boolean;
    };
    company: {
      required: boolean;
      visible: boolean;
    };
    message: {
      required: boolean;
      visible: boolean;
    };
    service: {
      required: boolean;
      visible: boolean;
      options: string[];
    };
  };
  steps: string[];
  successMessage: string;
  redirectUrl?: string;
}

export interface WebBooking {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId?: string;
  service?: string;
  pickupLocation: string;
  dropoffLocation?: string;
  pickupTime: string;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'website' | 'app' | 'phone' | 'email';
  notes?: string;
  createdAt: string;
  vehicleType?: string;
  estimatedPrice?: number;
}

export interface ApiIntegrationCredentials {
  clientId: string;
  clientSecret: string;
  apiKey: string;
  scopes: string[];
  createdAt: string;
  expiresAt?: string;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  logo: string;
  type: 'booking' | 'payment' | 'crm' | 'notification';
  status: 'active' | 'inactive' | 'deprecated';
  settings?: Record<string, any>;
  documentationUrl: string;
}
