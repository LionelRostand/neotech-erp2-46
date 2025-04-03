
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WebBookingConfig } from '../types/web-booking-types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Eye, ExternalLink } from 'lucide-react';
import WebBookingEditorSidebar from './WebBookingEditorSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WebBookingPreviewProps {
  isEditing?: boolean;
  preview?: boolean;
  currentPage?: string;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ 
  isEditing = true, 
  preview = false,
  currentPage = 'home'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(isEditing ? "edit" : "preview");
  const [activePage, setActivePage] = useState<string>(currentPage);
  const [config, setConfig] = useState<WebBookingConfig>(() => {
    // Get stored config from localStorage or use default
    const storedConfig = localStorage.getItem('web-booking-config');
    if (storedConfig) {
      try {
        return JSON.parse(storedConfig);
      } catch (e) {
        console.error('Failed to parse stored config:', e);
      }
    }
    
    // Return default config
    return {
      title: "RentaCar - Location de véhicules",
      subtitle: "Location de véhicules de qualité",
      logo: "/logo.png",
      primaryColor: "#ff5f00",
      secondaryColor: "#003366",
      headerBackground: "#ffffff",
      footerBackground: "#f5f5f5",
      fontFamily: "Inter",
      menuItems: [
        { id: '1', label: 'Accueil', url: '/', isExternal: false, isActive: true },
        { id: '2', label: 'Nos Véhicules', url: '/vehicules', isExternal: false, isActive: true },
        { id: '3', label: 'Tarifs', url: '/tarifs', isExternal: false, isActive: true },
        { id: '4', label: 'Contact', url: '/contact', isExternal: false, isActive: true },
      ],
      banner: {
        enabled: true,
        text: "Réservez votre véhicule en quelques clics",
        background: "#003366",
        textColor: "#ffffff",
        position: "top"
      },
      contactInfo: {
        phone: "+33 1 23 45 67 89",
        email: "contact@rentacar.fr",
        address: "15 Avenue des Champs-Élysées, 75008 Paris"
      },
      socialLinks: {
        facebook: "https://facebook.com/rentacar",
        twitter: "https://twitter.com/rentacar",
        instagram: "https://instagram.com/rentacar",
        linkedin: "https://linkedin.com/company/rentacar"
      },
      bookingFormSettings: {
        requireLogin: false,
        showPrices: true,
        allowTimeSelection: true,
        requirePhoneNumber: true,
        allowComments: true,
        paymentOptions: ["credit-card", "paypal", "bank-transfer"],
        termsUrl: "/terms"
      },
      enableBookingForm: true,
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
    };
  });

  // Handle config updates
  const handleConfigUpdate = (updates: Partial<WebBookingConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    // Save to localStorage
    localStorage.setItem('web-booking-config', JSON.stringify(newConfig));
  };

  // Update URL when page changes
  useEffect(() => {
    if (!preview) return;
    
    const pathBase = '/modules/transport/web-booking/preview';
    let path = pathBase;
    
    if (activePage && activePage !== 'home') {
      path = `${pathBase}/${activePage}`;
    }
    
    if (location.pathname !== path) {
      navigate(path);
    }
  }, [activePage, navigate, location.pathname, preview]);

  // Update active page based on URL when in preview mode
  useEffect(() => {
    if (!preview) return;
    
    const path = location.pathname;
    if (path.includes('/vehicules')) {
      setActivePage('vehicules');
    } else if (path.includes('/tarifs')) {
      setActivePage('tarifs');
    } else if (path.includes('/contact')) {
      setActivePage('contact');
    } else {
      setActivePage('home');
    }
  }, [location.pathname, preview]);

  // Go back to web booking main page
  const handleBack = () => {
    navigate('/modules/transport/web-booking');
  };
  
  // Handler for tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handler for navigating between preview pages
  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  return (
    <div className="h-full">
      {/* Top Bar with actions */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft size={16} />
          <span>Retour</span>
        </Button>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit size={16} />
                  <span>Éditer</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>Aperçu</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <Button variant="outline" className="gap-2">
            <ExternalLink size={16} />
            <span>Publier</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100%-80px)]">
        {isEditing ? (
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="edit" className="h-full mt-0">
              <div className="grid grid-cols-4 h-full gap-6">
                <div className="col-span-1 border-r pr-4 overflow-y-auto">
                  <WebBookingEditorSidebar config={config} onConfigUpdate={handleConfigUpdate} />
                </div>
                <div className="col-span-3">
                  <div className="bg-gray-100 h-full rounded-lg overflow-hidden border">
                    <div className="bg-white h-12 border-b flex items-center px-4">
                      <div className="flex gap-4">
                        {config.menuItems?.filter(item => item.isActive).map(item => (
                          <button 
                            key={item.id} 
                            className={`px-2 py-1 text-sm transition-colors ${
                              activePage === (item.url === '/' ? 'home' : item.url.replace('/', '')) 
                                ? `text-[${config.primaryColor}] font-medium` 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            onClick={() => handleNavigate(item.url === '/' ? 'home' : item.url.replace('/', ''))}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 h-[calc(100%-48px)] overflow-y-auto">
                      <WebsitePreviewContent 
                        activePage={activePage} 
                        config={config} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="preview" className="h-full mt-0">
              <div className="bg-gray-100 h-full rounded-lg overflow-hidden border">
                <div className="bg-white h-12 border-b flex items-center px-4">
                  <div className="flex gap-4">
                    {config.menuItems?.filter(item => item.isActive).map(item => (
                      <button 
                        key={item.id} 
                        className={`px-2 py-1 text-sm transition-colors ${
                          activePage === (item.url === '/' ? 'home' : item.url.replace('/', '')) 
                            ? `text-[${config.primaryColor}] font-medium` 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => handleNavigate(item.url === '/' ? 'home' : item.url.replace('/', ''))}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 h-[calc(100%-48px)] overflow-y-auto">
                  <WebsitePreviewContent 
                    activePage={activePage} 
                    config={config} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Preview only mode
          <div className="h-full">
            <div className="bg-gray-100 h-full rounded-lg overflow-hidden border">
              <div className="bg-white h-12 border-b flex items-center px-4">
                <div className="flex gap-4">
                  {config.menuItems?.filter(item => item.isActive).map(item => (
                    <button 
                      key={item.id} 
                      className={`px-2 py-1 text-sm transition-colors ${
                        activePage === (item.url === '/' ? 'home' : item.url.replace('/', '')) 
                          ? `text-[${config.primaryColor}] font-medium` 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleNavigate(item.url === '/' ? 'home' : item.url.replace('/', ''))}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 h-[calc(100%-48px)] overflow-y-auto">
                <WebsitePreviewContent 
                  activePage={activePage} 
                  config={config} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface WebsitePreviewContentProps {
  activePage: string;
  config: WebBookingConfig;
}

const WebsitePreviewContent: React.FC<WebsitePreviewContentProps> = ({ activePage, config }) => {
  // Render banner
  const renderBanner = () => {
    const bannerConfig = config.bannerConfig || {};
    const overlayStyle = bannerConfig.overlay 
      ? { backgroundColor: `rgba(0,0,0,${(bannerConfig.overlayOpacity || 50) / 100})` }
      : {};
      
    return (
      <div 
        className="relative h-64 mb-8 rounded-lg overflow-hidden"
        style={{ backgroundColor: bannerConfig.backgroundColor || '#003366' }}
      >
        {bannerConfig.backgroundImage && (
          <img 
            src={bannerConfig.backgroundImage} 
            alt="Banner" 
            className="w-full h-full object-cover absolute inset-0"
          />
        )}
        
        {bannerConfig.overlay && (
          <div 
            className="absolute inset-0"
            style={overlayStyle}
          ></div>
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: bannerConfig.textColor || '#ffffff' }}
          >
            {bannerConfig.title || "Réservez votre véhicule"}
          </h1>
          
          {bannerConfig.subtitle && (
            <p 
              className="text-lg mb-6 max-w-2xl"
              style={{ color: bannerConfig.textColor || '#ffffff' }}
            >
              {bannerConfig.subtitle}
            </p>
          )}
          
          {bannerConfig.buttonText && (
            <button 
              className="px-6 py-3 rounded-md font-medium"
              style={{ 
                backgroundColor: config.primaryColor || '#ff5f00',
                color: '#ffffff'
              }}
            >
              {bannerConfig.buttonText}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render booking form
  const renderBookingForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Réserver un véhicule</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lieu de prise en charge</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Ville ou aéroport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu de restitution</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Même que prise en charge"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <input type="date" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <input type="date" className="w-full p-2 border rounded-md" />
          </div>
        </div>
        
        <button
          className="w-full py-2 rounded-md font-medium text-white"
          style={{ backgroundColor: config.primaryColor || '#ff5f00' }}
        >
          Rechercher
        </button>
      </div>
    );
  };

  // Render homepage content
  const renderHomepage = () => {
    return (
      <>
        {renderBanner()}
        
        {config.enableBookingForm && renderBookingForm()}
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nos services</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Réservation rapide</h3>
              <p className="text-gray-600">Réservez votre véhicule en quelques clics, sans complications.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-100 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#10b981" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Annulation gratuite</h3>
              <p className="text-gray-600">Annulez jusqu'à 24h avant sans frais supplémentaires.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-100 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Meilleur prix garanti</h3>
              <p className="text-gray-600">Nous vous garantissons les tarifs les plus compétitifs.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Pourquoi nous choisir ?</h2>
          <div className="mb-4">
            <p className="mb-4">Nous sommes spécialisés dans la location de véhicules pour particuliers et professionnels depuis plus de 10 ans. Notre flotte variée et entretenue régulièrement vous garantit un service de qualité.</p>
            <p>Que vous ayez besoin d'une petite citadine pour vous déplacer en ville ou d'un véhicule plus spacieux pour vos vacances en famille, nous avons ce qu'il vous faut.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="mr-2 mt-1 text-green-500">✓</div>
              <div>
                <h4 className="font-medium">Véhicules récents</h4>
                <p className="text-sm text-gray-600">Notre flotte est renouvelée régulièrement</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-2 mt-1 text-green-500">✓</div>
              <div>
                <h4 className="font-medium">Assistance 24/7</h4>
                <p className="text-sm text-gray-600">Service client toujours disponible</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-2 mt-1 text-green-500">✓</div>
              <div>
                <h4 className="font-medium">Kilométrage illimité</h4>
                <p className="text-sm text-gray-600">Aucune restriction de distance</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-2 mt-1 text-green-500">✓</div>
              <div>
                <h4 className="font-medium">Assurance incluse</h4>
                <p className="text-sm text-gray-600">Tous nos véhicules sont assurés</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render vehicles page
  const renderVehiclesPage = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Nos Véhicules</h1>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map(index => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Voiture {index}</h3>
                  <span className="text-lg font-bold text-[#ff5f00]">50€ <span className="text-sm font-normal text-gray-500">/jour</span></span>
                </div>
                <p className="text-sm text-gray-500 mb-4">4 places • Automatique • Climatisation</p>
                <button 
                  className="w-full py-2 rounded font-medium text-white"
                  style={{ backgroundColor: config.primaryColor || '#ff5f00' }}
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render pricing page
  const renderPricingPage = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Nos Tarifs</h1>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Formule Économique</h3>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-bold" style={{ color: config.primaryColor }}>40€</span>
              <span className="text-gray-500 mb-1">/jour</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Petit véhicule citadin</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Kilométrage 100km/jour</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Assurance basique</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-500">GPS inclus</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-500">Assistance premium</span>
              </li>
            </ul>
            <button 
              className="w-full py-2 rounded font-medium text-white"
              style={{ backgroundColor: config.primaryColor || '#ff5f00' }}
            >
              Réserver
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-2" style={{ borderColor: config.primaryColor }}>
            <div className="absolute -mt-10 ml-auto mr-auto left-0 right-0 text-center w-32 px-2 py-1 rounded text-white text-sm" style={{ backgroundColor: config.primaryColor }}>
              Plus populaire
            </div>
            <h3 className="text-xl font-bold mb-2">Formule Confort</h3>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-bold" style={{ color: config.primaryColor }}>65€</span>
              <span className="text-gray-500 mb-1">/jour</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Véhicule berline ou SUV</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Kilométrage illimité</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Assurance tous risques</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>GPS inclus</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-500">Assistance premium</span>
              </li>
            </ul>
            <button 
              className="w-full py-2 rounded font-medium text-white"
              style={{ backgroundColor: config.primaryColor || '#ff5f00' }}
            >
              Réserver
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Formule Premium</h3>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-bold" style={{ color: config.primaryColor }}>95€</span>
              <span className="text-gray-500 mb-1">/jour</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Véhicule haut de gamme</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Kilométrage illimité</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Assurance tous risques</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>GPS inclus</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Assistance premium 24/7</span>
              </li>
            </ul>
            <button 
              className="w-full py-2 rounded font-medium text-white"
              style={{ backgroundColor: config.primaryColor || '#ff5f00' }}
            >
              Réserver
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Options additionnelles</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Siège enfant</span>
              <span className="font-bold">5€/jour</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Conducteur additionnel</span>
              <span className="font-bold">10€/jour</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>GPS</span>
              <span className="font-bold">7€/jour</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Wifi portable</span>
              <span className="font-bold">8€/jour</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render contact page
  const renderContactPage = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Envoyez-nous un message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input type="text" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sujet</label>
                <input type="text" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full p-2 border rounded-md" rows={5}></textarea>
              </div>
              <button 
                className="py-2 px-4 rounded font-medium text-white"
                style={{ backgroundColor: config.primaryColor || '#ff5f00' }}
              >
                Envoyer
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Nos coordonnées</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="text-gray-600">{config.contactInfo?.address || "15 Avenue des Champs-Élysées, 75008 Paris"}</p>
              </div>
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <p className="text-gray-600">{config.contactInfo?.phone || "+33 1 23 45 67 89"}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">{config.contactInfo?.email || "contact@rentacar.fr"}</p>
              </div>
              <div>
                <h3 className="font-medium">Horaires d'ouverture</h3>
                <p className="text-gray-600">Lundi - Vendredi: 8h - 20h</p>
                <p className="text-gray-600">Samedi: 9h - 18h</p>
                <p className="text-gray-600">Dimanche: 10h - 16h</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Suivez-nous</h3>
              <div className="flex space-x-4">
                {config.socialLinks?.facebook && (
                  <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5f00]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                )}
                {config.socialLinks?.twitter && (
                  <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5f00]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                )}
                {config.socialLinks?.instagram && (
                  <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5f00]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                )}
                {config.socialLinks?.linkedin && (
                  <a href={config.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5f00]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on active page
  switch (activePage) {
    case 'vehicules':
      return renderVehiclesPage();
    case 'tarifs':
      return renderPricingPage();
    case 'contact':
      return renderContactPage();
    case 'home':
    default:
      return renderHomepage();
  }
};

export default WebBookingPreview;
