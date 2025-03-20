
import React from 'react';
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import SyncSettingsForm from './SyncSettingsForm';

const CrmSyncTab: React.FC = () => {
  const handleSaveSettings = async (settings: any) => {
    // In a real implementation, this would save the settings to your backend
    console.log('Saving CRM sync settings:', settings);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Synchronisation avec votre CRM</h3>
        </div>

        <SyncSettingsForm 
          onSubmit={handleSaveSettings}
          defaultValues={{
            syncFrequency: 'daily'
          }}
        />
      </Card>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>La synchronisation avec votre CRM vous permet de maintenir vos contacts et entreprises à jour dans les deux systèmes.</p>
        <p className="mt-2">Pour plus d'informations sur l'intégration, consultez la documentation.</p>
      </div>
    </>
  );
};

export default CrmSyncTab;
