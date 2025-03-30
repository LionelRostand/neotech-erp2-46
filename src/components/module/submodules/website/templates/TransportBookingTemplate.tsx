
import React from 'react';
import { Car, Calendar, MapPin, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TransportBookingTemplateProps {
  primaryColor?: string;
  secondaryColor?: string;
}

const TransportBookingTemplate: React.FC<TransportBookingTemplateProps> = ({ 
  primaryColor = '#3b82f6',
  secondaryColor = '#6b7280'
}) => {
  return (
    <div className="transport-booking-template w-full">
      {/* Hero Section with Booking Form */}
      <div 
        className="relative bg-slate-900 text-white p-6 rounded-lg overflow-hidden"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1599037779235-c3740ba54b89?q=80&w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Réservez votre véhicule</h1>
            <p className="text-lg opacity-90 mb-8">Service de transport professionnel pour tous vos déplacements</p>
            
            <Card className="bg-white text-slate-900 rounded-xl shadow-lg">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-0.5 p-1">
                  <div className="p-4 flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-slate-600">Type de service</label>
                    <div className="flex items-center gap-2 h-10">
                      <Car className="h-5 w-5 text-slate-500" />
                      <select className="flex-1 bg-transparent outline-none">
                        <option>Transfert aéroport</option>
                        <option>Transport à l'heure</option>
                        <option>Aller simple</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-slate-600">Date & Heure</label>
                    <div className="flex items-center gap-2 h-10">
                      <Calendar className="h-5 w-5 text-slate-500" />
                      <input type="text" placeholder="25/07/2023 14:30" className="flex-1 outline-none" />
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-slate-600">Lieu de prise en charge</label>
                    <div className="flex items-center gap-2 h-10">
                      <MapPin className="h-5 w-5 text-slate-500" />
                      <input type="text" placeholder="Adresse de départ..." className="flex-1 outline-none" />
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col">
                    <label className="text-sm font-medium mb-1.5 text-slate-600">Passagers</label>
                    <div className="flex items-center gap-2 h-10">
                      <Users className="h-5 w-5 text-slate-500" />
                      <select className="flex-1 bg-transparent outline-none">
                        <option>1 personne</option>
                        <option>2 personnes</option>
                        <option>3 personnes</option>
                        <option>4+ personnes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-end">
                    <Button 
                      className="w-full h-10 rounded-md font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Réserver <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Nos services de transport</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Car className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-bold text-lg mb-2">Transfert aéroport</h3>
                <p className="text-muted-foreground">Service de prise en charge depuis ou vers les aéroports avec assistance bagages.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Calendar className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-bold text-lg mb-2">Location à l'heure</h3>
                <p className="text-muted-foreground">Véhicule avec chauffeur disponible pour plusieurs heures selon vos besoins.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <MapPin className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-bold text-lg mb-2">Transport longue distance</h3>
                <p className="text-muted-foreground">Service de transport confortable pour vos trajets longue distance.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Fleet Section */}
      <div className="py-12 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">Notre flotte de véhicules</h2>
          <p className="text-center text-muted-foreground mb-8">Des véhicules confortables et élégants pour tous vos déplacements</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-slate-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600" 
                  alt="Berline"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded font-medium text-sm">Berline</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Mercedes Classe E</h3>
                  <span className="text-sm">4 passagers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Idéal pour les transferts professionnels</span>
                  <span className="font-medium" style={{ color: primaryColor }}>À partir de 60€</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-slate-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600" 
                  alt="SUV"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded font-medium text-sm">SUV</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Audi Q7</h3>
                  <span className="text-sm">6 passagers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Confort et espace pour les groupes</span>
                  <span className="font-medium" style={{ color: primaryColor }}>À partir de 80€</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-slate-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1609520778163-a8a47b4f7acf?q=80&w=600" 
                  alt="Van"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded font-medium text-sm">Van</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Mercedes Classe V</h3>
                  <span className="text-sm">8 passagers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transport de groupes et bagages</span>
                  <span className="font-medium" style={{ color: primaryColor }}>À partir de 95€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="p-6" style={{ borderColor: primaryColor }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Besoin d'un devis personnalisé ?</h2>
                <p className="text-muted-foreground">Contactez-nous pour obtenir un devis adapté à vos besoins spécifiques</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">
                  Nous contacter
                </Button>
                <Button style={{ backgroundColor: primaryColor }}>
                  Demander un devis
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransportBookingTemplate;
