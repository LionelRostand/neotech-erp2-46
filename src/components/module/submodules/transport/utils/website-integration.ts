
import { WebsiteIntegration, WebBookingDesignConfig } from '../types/integration-types';

/**
 * Generates HTML code for integrating the transport booking widget into a website
 * 
 * @param apiKey The API key for authentication
 * @param serviceId The ID of the service to pre-select (optional)
 * @param designConfig Custom design configuration (optional)
 * @returns HTML code string for website integration
 */
export const generateIntegrationCode = (apiKey: string): string => {
  return `
<!-- Code d'intégration de réservation de transport -->
<div id="transport-booking-widget" data-api-key="${apiKey}" data-service-id="1">
  <script src="https://api.votre-domaine.com/transport/booking-widget.js"></script>
</div>
`;
};

/**
 * Creates a new website integration configuration
 * 
 * @param moduleId Module ID
 * @param pageId Page ID where the integration will be placed
 * @returns New WebsiteIntegration object
 */
export const createNewIntegration = (moduleId: string, pageId: string): WebsiteIntegration => {
  return {
    id: `integration-${Date.now()}`,
    moduleId,
    pageId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    formConfig: {
      fields: [
        {
          name: 'name',
          label: 'Nom complet',
          type: 'text',
          required: true,
          visible: true
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          visible: true
        },
        {
          name: 'phone',
          label: 'Téléphone',
          type: 'tel',
          required: true,
          visible: true
        },
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          required: true,
          visible: true
        }
      ],
      services: [
        {
          id: '1',
          name: 'Transport aéroport',
          price: 50,
          description: 'Navette depuis/vers l\'aéroport'
        },
        {
          id: '2',
          name: 'Location avec chauffeur',
          price: 75,
          description: 'Service de chauffeur privé à l\'heure'
        }
      ],
      submitButtonText: 'Réserver maintenant',
      successMessage: 'Votre réservation a été envoyée avec succès!',
      termsAndConditionsText: 'En réservant, vous acceptez nos conditions générales.'
    },
    designConfig: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '8px',
      buttonStyle: 'rounded',
      customCss: '',
      fontFamily: 'Inter, sans-serif',
      formWidth: '100%'
    }
  };
};

/**
 * Generates CSS for the booking widget based on design config
 * 
 * @param config Design configuration
 * @returns CSS string
 */
export const generateWidgetCSS = (config: WebBookingDesignConfig): string => {
  return `
.transport-booking-widget {
  background-color: ${config.backgroundColor};
  color: ${config.textColor};
  border-radius: ${config.borderRadius};
  font-family: ${config.fontFamily};
  max-width: ${config.formWidth};
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transport-booking-widget .widget-header {
  margin-bottom: 20px;
}

.transport-booking-widget .widget-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: ${config.primaryColor};
}

.transport-booking-widget .widget-button {
  background-color: ${config.primaryColor};
  color: white;
  border: none;
  border-radius: ${config.buttonStyle === 'rounded' ? '9999px' : 
                   config.buttonStyle === 'pill' ? '9999px' : '4px'};
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.transport-booking-widget .widget-button:hover {
  background-color: ${config.secondaryColor};
}

${config.customCss || ''}
`;
};

/**
 * Updates an existing website integration
 * 
 * @param integration The integration to update
 * @param updates The updates to apply
 * @returns Updated WebsiteIntegration object
 */
export const updateIntegration = (
  integration: WebsiteIntegration,
  updates: Partial<WebsiteIntegration>
): WebsiteIntegration => {
  return {
    ...integration,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Toggles the status of a website integration
 * 
 * @param integration The integration to toggle
 * @returns Updated WebsiteIntegration object with toggled status
 */
export const toggleIntegrationStatus = (integration: WebsiteIntegration): WebsiteIntegration => {
  const newStatus = integration.status === 'active' ? 'inactive' : 'active';
  return {
    ...integration,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
};
