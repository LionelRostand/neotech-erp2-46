
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Eye, Code } from 'lucide-react';
import SettingsForm from './SettingsForm';
import WebBookingPreview from './WebBookingPreview';

const WebsiteBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('settings');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Constructeur de site de réservation</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setActiveTab('settings')}
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            <span>Paramètres</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('preview')}
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            <span>Aperçu</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('code')}
            variant={activeTab === 'code' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Code size={16} />
            <span>Code</span>
          </Button>
        </div>
      </div>

      <div className="min-h-[600px] rounded-md border overflow-hidden">
        {activeTab === 'settings' && (
          <div className="p-6">
            <SettingsForm />
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="h-[600px]">
            <WebBookingPreview isEditing={false} />
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Code d'intégration</h3>
            <div className="bg-gray-100 border rounded-md p-4 font-mono text-sm whitespace-pre overflow-x-auto">
              {`<script src="https://example.com/web-booking/loader.js?id=12345"></script>
<div id="web-booking-container" data-theme="light"></div>`}
            </div>
            <div className="mt-4">
              <Button variant="outline">Copier le code</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;
