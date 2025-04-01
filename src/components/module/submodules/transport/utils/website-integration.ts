
import { WebsiteIntegration, WebBookingFormConfig, WebBookingDesignConfig, defaultDesignConfig, defaultFormConfig } from '../types/integration-types';

// Generate a unique ID for new integrations
const generateUniqueId = (): string => {
  return `integration-${Math.random().toString(36).substring(2, 9)}`;
};

// Generate integration code based on configuration
export const generateIntegrationCode = (integration: WebsiteIntegration): string => {
  const { apiKey, endpointUrl } = integration;
  
  return `<script>
  (function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '${endpointUrl}/loader.js?key=${apiKey}';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
<div id="transport-booking-widget"></div>
`;
};

// Create a new integration with default values
export const createNewIntegration = (): WebsiteIntegration => {
  const newApiKey = `key_${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    id: generateUniqueId(),
    name: 'New Website Integration',
    active: false,
    apiKey: newApiKey,
    endpointUrl: 'https://api.transport-booking.example.com',
    serviceTypes: ['airport', 'hourly', 'pointToPoint'],
    formConfig: { ...defaultFormConfig },
    designConfig: { ...defaultDesignConfig },
    pageId: 'homepage',
    status: 'pending'
  };
};

// Generate CSS based on design configuration
export const generateWidgetCSS = (design: WebBookingDesignConfig): string => {
  return `
.transport-widget {
  font-family: ${design.fontFamily || design.font};
  color: #333;
  background-color: #fff;
  border-radius: ${design.borderRadius};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: ${design.formWidth || '100%'};
  margin: 0 auto;
}

.transport-widget-header {
  background-color: ${design.primaryColor};
  color: white;
  padding: 1rem;
  border-top-left-radius: ${design.borderRadius};
  border-top-right-radius: ${design.borderRadius};
}

.transport-widget-button {
  background-color: ${design.primaryColor};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${design.buttonStyle === 'pill' ? '2rem' : design.buttonStyle === 'rounded' ? '0.25rem' : '0'};
  cursor: pointer;
}

${design.customCss || ''}

${design.darkMode ? `
.transport-widget {
  background-color: #1f2937;
  color: #e5e7eb;
}
` : ''}
  `;
};

// Preview the widget based on configuration
export const renderWidgetPreview = (formConfig: WebBookingFormConfig, designConfig: WebBookingDesignConfig): string => {
  // This would be replaced by actual widget rendering code
  return `
<div class="transport-widget" style="width: ${designConfig.formWidth || '100%'};">
  <div class="transport-widget-header">
    <h3>Book your transport</h3>
  </div>
  <div class="transport-widget-content" style="padding: 1rem;">
    <form>
      <!-- Service Type -->
      <div class="form-group">
        <label>Service Type</label>
        <select>
          ${formConfig.serviceTypes.filter(st => st.enabled).map(service => 
            `<option value="${service.id}">${service.name} ${service.price ? `- ${service.price}€` : ''}</option>`
          ).join('')}
        </select>
      </div>
      
      <!-- Required Fields -->
      ${formConfig.requiredFields.map(field => 
        `<div class="form-group">
          <label>${field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input type="${field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}" required />
        </div>`
      ).join('')}
      
      <!-- Optional Fields -->
      ${formConfig.optionalFields.map(field => 
        `<div class="form-group">
          <label>${field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input type="${field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}" />
        </div>`
      ).join('')}
      
      <button type="submit" class="transport-widget-button">Book Now</button>
    </form>
  </div>
</div>
`;
};

// Export the mocked integration data for development
export const mockIntegrations: WebsiteIntegration[] = [
  {
    id: 'int-001',
    name: 'Main Website Form',
    active: true,
    apiKey: 'key_abcdef123456',
    endpointUrl: 'https://api.transport-booking.example.com',
    serviceTypes: ['airport', 'hourly', 'pointToPoint', 'dayTour'],
    formConfig: { ...defaultFormConfig },
    designConfig: { ...defaultDesignConfig },
    pageId: 'contact-page',
    status: 'active'
  },
  {
    id: 'int-002',
    name: 'Partner Website Integration',
    active: false,
    apiKey: 'key_partner789012',
    endpointUrl: 'https://partner.example.org/api/transport',
    serviceTypes: ['airport', 'pointToPoint'],
    formConfig: {
      ...defaultFormConfig,
      requiredFields: ['name', 'email', 'phone', 'date'],
      serviceTypes: [
        {
          id: 'airport-vip',
          name: 'VIP Airport Transfer',
          price: 120,
          enabled: true,
        },
        {
          id: 'point-to-point',
          name: 'City Transfer',
          price: 80,
          enabled: true,
        }
      ]
    },
    designConfig: {
      ...defaultDesignConfig,
      primaryColor: '#c2410c',
      buttonStyle: 'pill',
    },
    pageId: 'homepage',
    status: 'inactive'
  }
];
