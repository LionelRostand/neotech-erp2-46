
import { WebsiteIntegration } from '../types/integration-types';

/**
 * Generates integration code based on the configuration
 * @param config Website integration configuration
 * @returns Generated code as a string
 */
export const generateIntegrationCode = (config: WebsiteIntegration): string => {
  const baseUrl = window.location.origin;
  const moduleId = config.moduleId;
  const integrationId = config.id;
  
  return `
<!-- Transport Booking Widget -->
<div id="transport-booking-${integrationId}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/api/bookings/widget.js?id=${integrationId}&moduleId=${moduleId}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
<!-- End Transport Booking Widget -->
  `.trim();
};

/**
 * Creates a new website integration configuration
 * @param moduleId ID of the module
 * @param pageId ID of the page
 * @param config Initial configuration
 * @returns Promise resolving to the created integration
 */
export const createNewIntegration = (moduleId: string, pageId: string, config: any): Promise<WebsiteIntegration> => {
  // This would typically be an API call
  // For now, we'll mock the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `integration-${Date.now()}`,
        moduleId,
        pageId,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formConfig: config.formConfig || {
          fields: [],
          services: [],
          submitButtonText: 'Réserver',
          successMessage: 'Merci pour votre réservation!',
          termsAndConditionsText: 'En soumettant ce formulaire, vous acceptez nos conditions générales.'
        },
        designConfig: config.designConfig || {
          primaryColor: '#3b82f6',
          secondaryColor: '#1e40af',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          borderRadius: '0.375rem',
          buttonStyle: 'rounded',
          fontFamily: 'sans-serif',
          formWidth: '100%'
        }
      });
    }, 500);
  });
};

/**
 * Updates an existing integration configuration
 * @param integrationId ID of the integration to update
 * @param config New configuration
 * @returns Promise resolving to the updated integration
 */
export const updateIntegration = (integrationId: string, config: Partial<WebsiteIntegration>): Promise<WebsiteIntegration> => {
  // This would typically be an API call
  // For now, we'll mock the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...config,
        id: integrationId,
        updatedAt: new Date().toISOString()
      } as WebsiteIntegration);
    }, 500);
  });
};

/**
 * Deletes an integration
 * @param integrationId ID of the integration to delete
 * @returns Promise resolving to success status
 */
export const deleteIntegration = (integrationId: string): Promise<boolean> => {
  // This would typically be an API call
  // For now, we'll mock the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
