
import React, { useState } from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import ClientPortalUserManager from './ClientPortalUserManager';
import ClientInviteForm from './ClientInviteForm';

const FreightClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Portail Client</h1>
        <p className="text-muted-foreground">
          Gérez l'accès des clients à votre portail de suivi d'expéditions
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="invite">Inviter un client</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="users" className="mt-0">
            <ClientPortalUserManager />
          </TabsContent>
          
          <TabsContent value="invite" className="mt-0">
            <ClientInviteForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FreightClientPortal;
