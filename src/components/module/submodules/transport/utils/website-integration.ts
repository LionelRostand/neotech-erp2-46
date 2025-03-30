
import { stringToTransportService, transportServiceToString } from './service-utils';
import { WebBookingFormConfig, WebBookingDesignConfig, WebsiteIntegration } from '../types/integration-types';
import { defaultDesignConfig, defaultFormConfig } from '../types/integration-types';

/**
 * Crée un code d'intégration pour le module Website
 * @param integration Configuration de l'intégration
 * @param type Type de code d'intégration ('iframe' | 'javascript')
 * @returns Le code HTML ou JavaScript à utiliser
 */
export const generateIntegrationCode = (
  integration: WebsiteIntegration, 
  type: 'iframe' | 'javascript', 
  domain: string = 'votre-domaine.com'
): string => {
  const integrationUrl = `https://${domain}/reservations-transport/${integration.id}`;
  
  if (type === 'iframe') {
    return `<iframe src="${integrationUrl}" 
    width="100%" 
    height="650" 
    frameborder="0">
</iframe>`;
  } else {
    return `<script>
  (function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '${integrationUrl}/embed.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
<div id="transport-booking-form"></div>`;
  }
};

/**
 * Crée une nouvelle intégration par défaut pour un site web
 * @param websiteModuleId L'ID du module website
 * @param pageId L'ID de la page (optionnel)
 * @returns Une nouvelle configuration d'intégration
 */
export const createNewIntegration = (websiteModuleId: string, pageId?: string): WebsiteIntegration => {
  const now = new Date().toISOString();
  
  return {
    id: `wbi-${Date.now()}`,
    websiteModuleId,
    pageId,
    status: 'inactive',
    formConfig: { ...defaultFormConfig },
    designConfig: { ...defaultDesignConfig },
    lastUpdated: now,
    createdAt: now,
  };
};

/**
 * Convertit les configurations de service en format compatible avec l'intégration
 * @param services Liste des services de transport
 * @returns Liste des IDs de service convertis en string
 */
export const convertServicesToIntegration = (services: any[]): string[] => {
  return services.map(service => 
    typeof service === 'string' ? service : transportServiceToString(service)
  );
};

/**
 * Génère le CSS personnalisé basé sur la configuration de design
 * @param config Configuration de design
 * @returns Code CSS à utiliser
 */
export const generateCustomCSS = (config: WebBookingDesignConfig): string => {
  return `
.transport-booking-form {
  --primary-color: ${config.primaryColor};
  --secondary-color: ${config.secondaryColor};
  --border-radius: ${getBorderRadiusValue(config.borderRadius)};
  font-family: ${config.fontFamily};
  max-width: ${getFormWidthValue(config.formWidth)};
}

.transport-booking-form button.primary {
  background-color: var(--primary-color);
}

.transport-booking-form .form-header {
  color: var(--primary-color);
}

${config.customCSS || ''}
  `;
};

// Fonctions utilitaires pour la conversion des valeurs de design
const getBorderRadiusValue = (radius: WebBookingDesignConfig['borderRadius']): string => {
  switch (radius) {
    case 'none': return '0';
    case 'small': return '0.25rem';
    case 'medium': return '0.5rem';
    case 'large': return '0.75rem';
    default: return '0.5rem';
  }
};

const getFormWidthValue = (width: WebBookingDesignConfig['formWidth']): string => {
  switch (width) {
    case 'narrow': return '400px';
    case 'medium': return '600px';
    case 'wide': return '800px';
    case 'full': return '100%';
    default: return '600px';
  }
};
