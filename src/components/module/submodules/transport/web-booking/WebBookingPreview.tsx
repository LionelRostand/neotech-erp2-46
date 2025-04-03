
import React from 'react';
import { WebBookingConfig } from '../types/web-booking-types';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface WebBookingPreviewProps {
  isEditing: boolean;
  config?: WebBookingConfig;
  preview?: boolean;
  currentPage?: string;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ 
  isEditing, 
  config, 
  preview = false,
  currentPage = 'home' 
}) => {
  const navigate = useNavigate();
  
  // Mock configuration if not provided
  const defaultConfig: Partial<WebBookingConfig> = {
    title: "RentaCar - Location de véhicules",
    subtitle: "Location de véhicules de qualité",
    primaryColor: "#ff5f00",
    secondaryColor: "#003366",
    bannerConfig: {
      title: "Réservez votre véhicule en quelques clics",
      subtitle: "Des tarifs compétitifs et un service de qualité pour tous vos déplacements",
      backgroundColor: "#003366",
      textColor: "#ffffff",
      buttonText: "Réserver maintenant",
      buttonLink: "#reservation"
    },
    menuItems: [
      { id: '1', label: 'Accueil', url: '/', isExternal: false, isActive: true },
      { id: '2', label: 'Nos Véhicules', url: '/vehicules', isExternal: false, isActive: true },
      { id: '3', label: 'Tarifs', url: '/tarifs', isExternal: false, isActive: true },
      { id: '4', label: 'Contact', url: '/contact', isExternal: false, isActive: true },
    ]
  };
  
  const displayConfig = config || defaultConfig as WebBookingConfig;
  const { bannerConfig, menuItems } = displayConfig;
  
  const getPageContent = () => {
    switch(currentPage) {
      case 'vehicules':
        return (
          <div className="py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Nos Véhicules</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-200 h-48"></div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Véhicule {i}</h3>
                    <p className="text-gray-600 text-sm mt-1">Catégorie: Économique</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="font-bold text-lg">45€/jour</span>
                      <Button size="sm">Réserver</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'tarifs':
        return (
          <div className="py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Nos Tarifs</h1>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Catégorie</th>
                    <th className="border p-3 text-left">1-3 jours</th>
                    <th className="border p-3 text-left">4-7 jours</th>
                    <th className="border p-3 text-left">8+ jours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-medium">Économique</td>
                    <td className="border p-3">45€/jour</td>
                    <td className="border p-3">40€/jour</td>
                    <td className="border p-3">35€/jour</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">Confort</td>
                    <td className="border p-3">65€/jour</td>
                    <td className="border p-3">60€/jour</td>
                    <td className="border p-3">55€/jour</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">SUV</td>
                    <td className="border p-3">80€/jour</td>
                    <td className="border p-3">75€/jour</td>
                    <td className="border p-3">70€/jour</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">Premium</td>
                    <td className="border p-3">120€/jour</td>
                    <td className="border p-3">110€/jour</td>
                    <td className="border p-3">100€/jour</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Options supplémentaires</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Assurance tous risques: 15€/jour</li>
                <li>Siège enfant: 5€/jour</li>
                <li>GPS: 7€/jour</li>
                <li>Conducteur supplémentaire: 10€/jour</li>
              </ul>
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Formulaire de contact</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Nom</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" className="w-full p-2 border rounded" placeholder="Votre email" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Téléphone</label>
                    <input type="tel" className="w-full p-2 border rounded" placeholder="Votre téléphone" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Message</label>
                    <textarea className="w-full p-2 border rounded" rows={4} placeholder="Votre message"></textarea>
                  </div>
                  <Button type="button" className="w-full">Envoyer</Button>
                </form>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p>15 Avenue des Champs-Élysées, 75008 Paris</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p>+33 1 23 45 67 89</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>contact@rentacar.fr</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Horaires d'ouverture</h3>
                    <p>Lundi - Vendredi: 8h00 - 19h00</p>
                    <p>Samedi: 9h00 - 17h00</p>
                    <p>Dimanche: 10h00 - 16h00</p>
                  </div>
                </div>
                <div className="mt-6 h-60 bg-gray-200 rounded">
                  {/* Map placeholder */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Carte Google Maps
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: // home page
        return (
          <>
            {/* Banner */}
            <div 
              className="py-24 px-4 bg-cover bg-center relative"
              style={{ 
                backgroundColor: bannerConfig?.backgroundColor || '#003366',
                color: bannerConfig?.textColor || '#ffffff',
                backgroundImage: bannerConfig?.backgroundImage ? `url(${bannerConfig.backgroundImage})` : 'none'
              }}
            >
              {bannerConfig?.overlay && (
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: (bannerConfig?.overlayOpacity || 50) / 100 }}
                ></div>
              )}
              <div className="container mx-auto text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {bannerConfig?.title || "Réservez votre véhicule en quelques clics"}
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                  {bannerConfig?.subtitle || "Des tarifs compétitifs et un service de qualité pour tous vos déplacements"}
                </p>
                {bannerConfig?.buttonText && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 text-white border-white hover:bg-white/20"
                  >
                    {bannerConfig.buttonText}
                  </Button>
                )}
              </div>
            </div>

            {/* Booking Form Section */}
            <div className="py-12 px-4 bg-gray-50" id="reservation">
              <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-8">
                  {displayConfig.title || "Réservez votre véhicule"}
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">Lieu de prise en charge</label>
                      <select className="w-full p-3 border rounded-md">
                        <option>Paris Centre</option>
                        <option>Aéroport Charles de Gaulle</option>
                        <option>Gare de Lyon</option>
                        <option>Paris La Défense</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Lieu de restitution</label>
                      <select className="w-full p-3 border rounded-md">
                        <option>Paris Centre</option>
                        <option>Aéroport Charles de Gaulle</option>
                        <option>Gare de Lyon</option>
                        <option>Paris La Défense</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Date de départ</label>
                      <input type="date" className="w-full p-3 border rounded-md" />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Date de retour</label>
                      <input type="date" className="w-full p-3 border rounded-md" />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Heure de départ</label>
                      <input type="time" className="w-full p-3 border rounded-md" />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Heure de retour</label>
                      <input type="time" className="w-full p-3 border rounded-md" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full py-3">Rechercher un véhicule</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="py-12 px-4">
              <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-12">Nos services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6">
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Large gamme de véhicules</h3>
                    <p className="text-gray-600">Du compact économique au premium luxueux, trouvez le véhicule qui correspond à vos besoins.</p>
                  </div>
                  <div className="p-6">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Entretien rigoureux</h3>
                    <p className="text-gray-600">Tous nos véhicules sont régulièrement entretenus pour garantir votre sécurité et confort.</p>
                  </div>
                  <div className="p-6">
                    <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Assurances complètes</h3>
                    <p className="text-gray-600">Optez pour nos assurances complètes pour une tranquillité d'esprit totale pendant votre location.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };
  
  const getNavLinks = () => {
    // In preview mode, create links to the preview routes
    if (preview) {
      return menuItems?.map(item => {
        const url = item.url === '/' 
          ? '/modules/transport/web-booking/preview'
          : `/modules/transport/web-booking/preview${item.url}`;
          
        return (
          <li key={item.id} className={`${currentPage === item.url.replace('/', '') || (currentPage === 'home' && item.url === '/') ? 'font-bold' : ''}`}>
            <Link to={url} className="px-4 py-2 block hover:text-blue-500 transition-colors">
              {item.label}
            </Link>
          </li>
        );
      });
    }
    
    // In regular mode (editor preview), just render list items without links
    return menuItems?.map(item => (
      <li key={item.id}>
        <span className="px-4 py-2 block hover:bg-gray-100 cursor-pointer">
          {item.label}
        </span>
      </li>
    ));
  };
  
  // Render a full-screen preview with back button when in preview mode
  if (preview) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-gray-100 p-2 flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/modules/transport/web-booking')}
            className="text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à l'éditeur
          </Button>
          <span className="ml-4 text-sm text-gray-500">
            Prévisualisation du site de réservation | Page: {currentPage}
          </span>
        </div>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto flex justify-between items-center p-4">
            <div className="font-bold text-xl">{displayConfig.title || "RentaCar"}</div>
            <nav>
              <ul className="flex space-x-2">
                {getNavLinks()}
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {getPageContent()}
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">À propos de nous</h3>
                <p className="text-gray-300">
                  Nous proposons des services de location de véhicules de qualité depuis plus de 15 ans.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white">Conditions générales</a></li>
                  <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Contact</h3>
                <p className="text-gray-300">15 Avenue des Champs-Élysées, 75008 Paris</p>
                <p className="text-gray-300">+33 1 23 45 67 89</p>
                <p className="text-gray-300">contact@rentacar.fr</p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>© {new Date().getFullYear()} {displayConfig.title || "RentaCar"}. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  
  // When in editor, show a smaller preview without top/bottom bars
  return (
    <div className={`w-full ${isEditing ? 'border rounded-lg overflow-hidden bg-white' : ''}`}>
      <div className="overflow-hidden">
        <header className="bg-white border-b">
          <div className="container mx-auto flex justify-between items-center p-4">
            <div className="font-bold text-xl">{displayConfig.title || "RentaCar"}</div>
            <nav>
              <ul className="flex space-x-2">
                {getNavLinks()}
              </ul>
            </nav>
          </div>
        </header>

        <main>
          {getPageContent()}
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {displayConfig.title || "RentaCar"}. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
      
      {isEditing && (
        <div className="p-4 bg-gray-100 border-t flex justify-center">
          <Button 
            onClick={() => window.open('/modules/transport/web-booking/preview', '_blank')}
            variant="outline" 
            size="sm"
          >
            Voir en plein écran
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebBookingPreview;
