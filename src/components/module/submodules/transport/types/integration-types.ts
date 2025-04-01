
// Types related to integrations with other systems or modules

export interface WebsiteIntegration {
  id: string;
  name: string;
  active: boolean;
  apiKey: string;
  endpointUrl: string;
  serviceTypes: string[];
  formConfig: WebBookingFormConfig;
  designConfig: WebBookingDesignConfig;
  websiteModuleId?: string;
}

export interface WebBookingFormConfig {
  requiredFields: string[];
  optionalFields: string[];
  allowsCustomService: boolean;
  serviceTypes: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    enabled: boolean;
  }[];
}

export interface WebBookingDesignConfig {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  borderRadius: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  darkMode: boolean;
  logo?: string;
  customCss?: string;
}

export interface IntegrationLog {
  id: string;
  integrationId: string;
  timestamp: string;
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  details?: any;
}

export interface EmailIntegration {
  id: string;
  provider: 'smtp' | 'api' | 'custom';
  smtpSettings?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  apiSettings?: {
    url: string;
    key: string;
    secretKey?: string;
  };
  defaultFrom: string;
  templates: EmailTemplate[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
}

export interface SmsIntegration {
  id: string;
  provider: string;
  apiKey: string;
  defaultSender: string;
  templates: SmsTemplate[];
}

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

// Default configuration exports
export const defaultDesignConfig: WebBookingDesignConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#f3f4f6',
  font: 'Inter, sans-serif',
  borderRadius: '0.375rem',
  buttonStyle: 'rounded',
  darkMode: false,
};

export const defaultFormConfig: WebBookingFormConfig = {
  requiredFields: ['name', 'email', 'phone', 'date', 'time'],
  optionalFields: ['message', 'address', 'passengers'],
  allowsCustomService: true,
  serviceTypes: [
    {
      id: 'airport-transfer',
      name: 'Airport Transfer',
      description: 'Comfortable transfer to or from the airport',
      price: 60,
      enabled: true,
    },
    {
      id: 'city-tour',
      name: 'City Tour',
      description: 'Explore the city with our professional drivers',
      price: 80,
      enabled: true,
    },
    {
      id: 'business',
      name: 'Business Transportation',
      description: 'Reliable transportation for business meetings',
      price: 70,
      enabled: true,
    },
  ],
};
