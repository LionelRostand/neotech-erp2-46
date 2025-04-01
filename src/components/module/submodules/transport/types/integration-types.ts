
// Define types for website integration

export interface WebsiteIntegration {
  id: string;
  moduleId: string;
  pageId: string; // ID of the website page for integration
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  formConfig: WebBookingFormConfig;
  designConfig: WebBookingDesignConfig;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'date' | 'time' | 'number' | 'textarea';
  required: boolean;
  visible: boolean;
  options?: { value: string; label: string }[];
}

export interface WebBookingService {
  id: string;
  name: string;
  price?: number;
  description?: string;
}

export interface WebBookingFormConfig {
  fields: FormField[];
  services: WebBookingService[];
  submitButtonText: string;
  successMessage: string;
  termsAndConditionsText: string;
}

export interface WebBookingDesignConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  customCss?: string;
  fontFamily: string;
  formWidth: string;
}
