
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WebBookingConfig, MenuItem, BannerConfig } from '../types';
import CustomerContactForm from './CustomerContactForm';

interface WebBookingPreviewProps {
  isEditing: boolean;
  config?: WebBookingConfig;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ 
  isEditing, 
  config = {
    siteTitle: "RentaCar - Location de véhicules",
    logo: "/logo.png",
    primaryColor: "#ff5f00",
    secondaryColor: "#003366",
    fontFamily: "Inter",
    enableBookingForm: true,
    requiredFields: ["pickup_location", "dropoff_location", "pickup_date", "dropoff_date"],
    menuItems: [
      { id: '1', label: 'Accueil', url: '/', isActive: true },
      { id: '2', label: 'Nos Véhicules', url: '/vehicules', isActive: true },
      { id: '3', label: 'Tarifs', url: '/tarifs', isActive: true },
      { id: '4', label: 'Contact', url: '/contact', isActive: true },
    ],
    bannerConfig: {
      title: "Réservez votre véhicule en quelques clics",
      subtitle: "Des tarifs compétitifs et un service de qualité pour tous vos déplacements",
      backgroundColor: "#003366",
      textColor: "#ffffff",
      backgroundImage: "/images/car1.jpg",
      buttonText: "Réserver maintenant",
      buttonLink: "#reservation",
      overlay: true,
      overlayOpacity: 50,
    }
  } 
}) => {
  const getOverlayStyle = () => {
    const bannerConfig = config.bannerConfig;
    if (!bannerConfig || !bannerConfig.overlay) return {};
    return {
      backgroundColor: `rgba(0,0,0,${bannerConfig.overlayOpacity / 100})`
    };
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            {config.logo && (
              <img src={config.logo} alt="Logo" className="h-10 w-auto mr-4" />
            )}
            <h1 className="text-xl font-bold">{config.siteTitle}</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              {config.menuItems?.filter(item => item.isActive).map(item => (
                <li key={item.id}>
                  <a 
                    href="#" 
                    className="text-gray-800 hover:text-[#ff5f00]"
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Banner */}
      {config.bannerConfig && (
        <div 
          className="relative overflow-hidden"
          style={{ backgroundColor: config.bannerConfig.backgroundColor }}
        >
          {config.bannerConfig.backgroundImage && (
            <img 
              src={config.bannerConfig.backgroundImage} 
              alt="Banner" 
              className="w-full object-cover"
              style={{ height: '400px' }}
            />
          )}
          
          {config.bannerConfig.overlay && (
            <div 
              className="absolute inset-0"
              style={getOverlayStyle()}
            ></div>
          )}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <h2 
              className="text-4xl font-bold mb-4"
              style={{ color: config.bannerConfig.textColor }}
            >
              {config.bannerConfig.title}
            </h2>
            
            <p
              className="text-xl mb-8 max-w-3xl"
              style={{ color: config.bannerConfig.textColor }}
            >
              {config.bannerConfig.subtitle}
            </p>
            
            <Button
              size="lg"
              className="text-white"
              style={{ backgroundColor: config.primaryColor }}
              onClick={(e) => e.preventDefault()}
            >
              {config.bannerConfig.buttonText}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        {/* Quick Search Form */}
        <Card className="p-6 mb-12 shadow-lg -mt-16 relative z-10 mx-auto max-w-4xl bg-white">
          <h3 className="text-lg font-bold mb-4 text-center">Réservez votre véhicule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lieu de prise en charge</label>
              <select className="w-full border rounded p-2">
                <option>Paris Gare de Lyon</option>
                <option>Paris CDG Aéroport</option>
                <option>Paris Orly Aéroport</option>
                <option>Lyon Centre</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date de départ</label>
              <input type="date" className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date de retour</label>
              <input type="date" className="w-full border rounded p-2" />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              className="text-white px-8" 
              style={{ backgroundColor: config.primaryColor }}
            >
              Rechercher
            </Button>
          </div>
        </Card>

        {/* Car Categories */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Nos catégories de véhicules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Économique', image: '/images/car1.jpg', price: 'À partir de 39€/jour' },
              { name: 'Compacte', image: '/images/car2.jpg', price: 'À partir de 45€/jour' },
              { name: 'Berline', image: '/images/car3.jpg', price: 'À partir de 65€/jour' },
              { name: 'SUV', image: '/images/car4.jpg', price: 'À partir de 70€/jour' }
            ].map((category, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold">{category.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{category.price}</p>
                  <Button 
                    variant="outline"
                    className="mt-2 w-full border-[#ff5f00] text-[#ff5f00] hover:bg-[#ff5f00] hover:text-white"
                  >
                    Voir les véhicules
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 py-12 bg-gray-50 -mx-6 px-6">
          <h3 className="text-2xl font-bold mb-6 text-center">Pourquoi nous choisir</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-[#ff5f00] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Assurance tous risques</h4>
              <p className="text-gray-600">Tous nos véhicules sont assurés pour votre tranquillité d'esprit.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-[#ff5f00] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Assistance 24/7</h4>
              <p className="text-gray-600">Notre service client est disponible à tout moment pour vous aider.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-[#ff5f00] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Kilométrage illimité</h4>
              <p className="text-gray-600">Profitez de la liberté avec notre option kilométrage illimité.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Contactez-nous</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <CustomerContactForm isEditable={false} />
            </div>
            
            <div className="bg-gray-100 p-6 rounded">
              <h4 className="font-bold mb-4">Nos agences</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium">Paris Centre</h5>
                  <p className="text-sm">123 Avenue des Champs-Élysées, 75008 Paris</p>
                  <p className="text-sm">Tél: 01 23 45 67 89</p>
                </div>
                
                <div>
                  <h5 className="font-medium">Lyon Centre</h5>
                  <p className="text-sm">45 Rue de la République, 69002 Lyon</p>
                  <p className="text-sm">Tél: 04 56 78 90 12</p>
                </div>
                
                <div>
                  <h5 className="font-medium">Marseille Centre</h5>
                  <p className="text-sm">78 La Canebière, 13001 Marseille</p>
                  <p className="text-sm">Tél: 04 91 23 45 67</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">À propos de nous</h4>
              <p className="text-sm text-gray-300">RentaCar est une entreprise française de location de véhicules présente dans toutes les grandes villes françaises.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {config.menuItems?.filter(item => item.isActive).map(item => (
                  <li key={item.id}>
                    <a href="#" className="hover:text-[#ff5f00]">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Nos services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-[#ff5f00]">Location courte durée</a></li>
                <li><a href="#" className="hover:text-[#ff5f00]">Location longue durée</a></li>
                <li><a href="#" className="hover:text-[#ff5f00]">Location avec chauffeur</a></li>
                <li><a href="#" className="hover:text-[#ff5f00]">Services aux entreprises</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Nous contacter</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Tél: 01 23 45 67 89</li>
                <li>Email: contact@rentacar.fr</li>
                <li>Adresse: 123 Avenue des Champs-Élysées, 75008 Paris</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-6 text-sm text-gray-400 flex justify-between">
            <p>&copy; 2023 RentaCar. Tous droits réservés.</p>
            <div className="space-x-4">
              <a href="#" className="hover:text-[#ff5f00]">Mentions légales</a>
              <a href="#" className="hover:text-[#ff5f00]">CGV</a>
              <a href="#" className="hover:text-[#ff5f00]">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebBookingPreview;
