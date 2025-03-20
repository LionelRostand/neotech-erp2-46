
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { RefreshCw, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SyncSettingsForm from './SyncSettingsForm';
import { toast } from "sonner";

const CrmSyncTab: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveSettings = async (settings: any) => {
    // In a real implementation, this would save the settings to your backend
    console.log('Saving CRM sync settings:', settings);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show sync status
    setSyncStatus('success');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setSyncStatus('idle');
    }, 3000);
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Synchronisation avec votre CRM</h3>
        </div>

        {syncStatus === 'success' && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Configuration du CRM enregistrée avec succès.
            </AlertDescription>
          </Alert>
        )}

        <SyncSettingsForm 
          onSubmit={handleSaveSettings}
          defaultValues={{
            syncFrequency: 'daily',
            syncContacts: true,
            syncCompanies: true,
            syncDeals: false,
            lastSyncedAt: new Date().toISOString()
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
