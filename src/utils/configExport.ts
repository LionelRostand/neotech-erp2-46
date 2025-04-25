
import { COLLECTIONS } from '@/lib/firebase-collections';

interface AppConfig {
  collections: typeof COLLECTIONS;
  appName: string;
  version: string;
  environment: string;
  timestamp: string;
}

export const exportAppConfig = (): AppConfig => {
  const config: AppConfig = {
    collections: COLLECTIONS,
    appName: 'NEOTECH-ERP',
    version: '1.0.0',
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString()
  };

  // Création du fichier de configuration
  const configString = JSON.stringify(config, null, 2);
  const blob = new Blob([configString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Création et déclenchement du téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.download = `neotech-erp-config-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return config;
};
