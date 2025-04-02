
import React from 'react';
import TransportBookingTemplate from '../../website/templates/TransportBookingTemplate';
import CustomerContactForm from './CustomerContactForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Car, Calendar, MessageSquare, Home } from 'lucide-react';

interface WebBookingPreviewProps {
  isEditing: boolean;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ isEditing }) => {
  return (
    <div className={isEditing ? "border rounded-lg" : "bg-background"}>
      <div className={isEditing ? "px-4 py-2 border-b flex items-center justify-between bg-muted/50" : "hidden"}>
        <span className="text-sm font-medium">Aperçu du site</span>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className={isEditing ? "p-4 bg-background overflow-auto" : ""}>
        <Tabs defaultValue="home" className="w-full">
          <div className="border-b mb-6">
            <div className="max-w-screen-lg mx-auto">
              <TabsList className="bg-transparent justify-center">
                <TabsTrigger value="home" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                  <Car className="w-4 h-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="booking" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Réservation
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="max-w-screen-lg mx-auto">
            <TabsContent value="home">
              <TransportBookingTemplate isEditable={isEditing} />
            </TabsContent>
            
            <TabsContent value="services">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center">Nos Services de Transport</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["VTC", "Navette Aéroport", "Location avec Chauffeur"].map((service, index) => (
                    <div key={index} className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-medium mb-2">{service}</h3>
                      <p className="text-muted-foreground">
                        Description détaillée du service de transport proposé à nos clients.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="booking">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center">Réservez votre trajet</h2>
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                  <p className="text-center text-muted-foreground mb-6">
                    Formulaire de réservation en cours d'élaboration
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse de départ</label>
                      <input type="text" className="w-full border rounded px-3 py-2" placeholder="Saisissez l'adresse de départ" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse d'arrivée</label>
                      <input type="text" className="w-full border rounded px-3 py-2" placeholder="Saisissez l'adresse d'arrivée" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input type="date" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure</label>
                      <input type="time" className="w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="bg-primary text-white px-4 py-2 rounded">Vérifier la disponibilité</button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Contactez-nous</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <CustomerContactForm isEditable={isEditing} />
                  </div>
                  <div>
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                      <h3 className="text-lg font-medium mb-4">Nos coordonnées</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Adresse</p>
                          <p className="text-muted-foreground">123 Avenue du Transport, 75000 Paris, France</p>
                        </div>
                        <div>
                          <p className="font-medium">Téléphone</p>
                          <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">contact@transport-service.fr</p>
                        </div>
                        <div>
                          <p className="font-medium">Horaires</p>
                          <p className="text-muted-foreground">Lun-Ven: 8h-19h | Sam: 9h-17h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WebBookingPreview;
