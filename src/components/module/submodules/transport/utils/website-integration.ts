
import { WebsiteIntegration, WebBookingFormConfig, WebBookingDesignConfig } from '../types/integration-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate code for embedding the booking form in a website
 * @param integration The integration configuration
 * @param type The type of code to generate (iframe or javascript)
 * @param domain The domain where the application is hosted
 */
export const generateIntegrationCode = (
  integration: WebsiteIntegration,
  type: 'iframe' | 'javascript',
  domain: string
): string => {
  if (!integration || !integration.id) {
    return '// Cannot generate code: Invalid integration configuration';
  }
  
  if (type === 'iframe') {
    return `<!-- Transport Booking Form Embed -->
<iframe 
  src="https://${domain}/embed/bookings/${integration.id}" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
  title="Service de réservation de transport"
></iframe>`;
  } else {
    return `<!-- Transport Booking Form JavaScript Embed -->
<div id="transport-booking-container"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.src = "https://${domain}/embed/bookings/${integration.id}/script.js";
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;
  }
};

/**
 * Create a new website integration 
 */
export const createNewIntegration = (moduleId: string, pageId: string): WebsiteIntegration => {
  return {
    id: uuidv4(),
    moduleId,
    pageId,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    formConfig: getDefaultFormConfig(),
    designConfig: getDefaultDesignConfig()
  };
};

/**
 * Get default form configuration
 */
const getDefaultFormConfig = (): WebBookingFormConfig => {
  return {
    fields: [
      { name: 'name', label: 'Nom', required: true, type: 'text', visible: true },
      { name: 'email', label: 'Email', required: true, type: 'email', visible: true },
      { name: 'phone', label: 'Téléphone', required: true, type: 'tel', visible: true },
      { name: 'service', label: 'Service', required: true, type: 'select', visible: true },
      { name: 'date', label: 'Date', required: true, type: 'date', visible: true },
      { name: 'time', label: 'Heure', required: true, type: 'time', visible: true },
      { name: 'passengers', label: 'Passagers', required: false, type: 'number', visible: true },
      { name: 'notes', label: 'Notes', required: false, type: 'textarea', visible: true }
    ],
    services: [
      { id: 'airport', name: 'Transfert Aéroport', price: 90, description: 'Transfert depuis/vers l\'aéroport' },
      { id: 'hourly', name: 'Location à l\'heure', price: 70, description: 'Location avec chauffeur à l\'heure' },
      { id: 'pointToPoint', name: 'Trajet Simple', price: 50, description: 'Transport d\'un point à un autre' }
    ],
    submitButtonText: 'Réserver maintenant',
    successMessage: 'Nous avons bien reçu votre demande de réservation. Nous vous contacterons sous peu pour confirmer les détails.',
    termsAndConditionsText: 'En soumettant ce formulaire, vous acceptez nos conditions générales d\'utilisation.'
  };
};

/**
 * Get default design configuration
 */
const getDefaultDesignConfig = (): WebBookingDesignConfig => {
  return {
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    fontFamily: 'system-ui, sans-serif',
    formWidth: '480px',
    borderRadius: '8px',
    buttonStyle: 'rounded',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    customCss: ''
  };
};
