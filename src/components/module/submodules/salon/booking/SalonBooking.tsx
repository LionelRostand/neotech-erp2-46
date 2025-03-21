
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookingConfiguration from './components/BookingConfiguration';
import ClientPortalPreview from './components/ClientPortalPreview';
import NotificationsSettings from './components/NotificationsSettings';
import PaymentSettings from './components/PaymentSettings';

const SalonBooking = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold">Réservation Web & Mobile</h2>
        <p className="text-muted-foreground">
          Plateforme de réservation en ligne pour vos clients via site web et application mobile
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Statut du module</CardTitle>
          <CardDescription>
            Ce module est en cours de déploiement. Certaines fonctionnalités peuvent être limitées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <span className="text-sm font-medium">En cours de déploiement</span>
            </div>
            <div className="text-sm text-muted-foreground">Lancement prévu : Q3 2023</div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="configuration" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="client-portal">Espace Client</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration">
          <BookingConfiguration />
        </TabsContent>
        
        <TabsContent value="client-portal">
          <ClientPortalPreview />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonBooking;
