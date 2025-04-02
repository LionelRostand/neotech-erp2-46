
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Calendar, Clock, Users, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

const WebBookingEditorSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Éléments</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <Car size={16} />, label: 'Véhicule' },
            { icon: <Calendar size={16} />, label: 'Date' },
            { icon: <Clock size={16} />, label: 'Heure' },
            { icon: <Users size={16} />, label: 'Passagers' },
            { icon: <MapPin size={16} />, label: 'Adresse' },
            { icon: <Phone size={16} />, label: 'Téléphone' },
            { icon: <Mail size={16} />, label: 'Email' },
            { icon: <CreditCard size={16} />, label: 'Paiement' }
          ].map((item, index) => (
            <Button key={index} variant="outline" className="flex flex-col items-center justify-center h-auto py-3 px-1" draggable>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="styles">
        <AccordionItem value="styles">
          <AccordionTrigger className="text-sm font-medium">Styles</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border flex items-center justify-center bg-primary"></div>
                  <Input id="primary-color" defaultValue="#3b82f6" className="w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font">Police</Label>
                <select
                  id="font"
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                  defaultValue="Inter"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-style">Style des boutons</Label>
                <select
                  id="button-style"
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                  defaultValue="rounded"
                >
                  <option value="rounded">Arrondi</option>
                  <option value="square">Carré</option>
                  <option value="pill">Pilule</option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pages">
          <AccordionTrigger className="text-sm font-medium">Pages</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                Page d'accueil
              </div>
              <div className="p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                Formulaire de réservation
              </div>
              <div className="p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                Confirmation
              </div>
              <Button variant="ghost" className="w-full justify-start text-sm mt-2">
                + Ajouter une page
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sections">
          <AccordionTrigger className="text-sm font-medium">Sections</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                En-tête
              </div>
              <div className="p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                Formulaire
              </div>
              <div className="p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                Services
              </div>
              <div className="p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted/70 transition-colors">
                Pied de page
              </div>
              <Button variant="ghost" className="w-full justify-start text-sm mt-2">
                + Ajouter une section
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default WebBookingEditorSidebar;
