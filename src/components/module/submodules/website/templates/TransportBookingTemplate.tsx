
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Car, Calendar, Clock } from 'lucide-react';

interface TransportBookingTemplateProps {
  isEditable?: boolean;
}

const TransportBookingTemplate: React.FC<TransportBookingTemplateProps> = ({ isEditable = false }) => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Service de Transport</h1>
        <p className="text-lg text-muted-foreground">
          Réservez votre trajet facilement et rapidement
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6">Réservez maintenant</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure">Point de départ</Label>
                <Input id="departure" placeholder="Adresse de départ" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Adresse de destination" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex items-center border rounded-md px-3 py-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input id="date" type="date" className="border-0 p-0 focus-visible:ring-0" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <div className="flex items-center border rounded-md px-3 py-2">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input id="time" type="time" className="border-0 p-0 focus-visible:ring-0" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Type de véhicule</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="vehicle-type">
                    <SelectValue placeholder="Sélectionnez un type de véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passengers">Nombre de passagers</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="passengers">
                    <SelectValue placeholder="Sélectionnez le nombre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditable && (
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="votre@email.com" />
                </div>
              )}
              
              {isEditable && (
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input id="contact-phone" type="tel" placeholder="Votre numéro de téléphone" />
                </div>
              )}
              
              <div className="pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Réserver maintenant
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="bg-blue-50 p-8 rounded-lg h-full flex items-center justify-center">
            <div className="text-center">
              <Car className="w-24 h-24 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Service de qualité</h3>
              <p className="text-gray-600">
                Notre flotte de véhicules est maintenue aux normes les plus élevées pour vous garantir un trajet sûr et confortable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportBookingTemplate;
