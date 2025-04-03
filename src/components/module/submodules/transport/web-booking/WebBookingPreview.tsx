import React, { useState } from 'react';
import { WebBookingConfig } from '../types/web-booking-types';

interface WebBookingPreviewProps {
  isEditing: boolean;
  config: WebBookingConfig;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ isEditing, config }) => {
  const [activeMenuPath, setActiveMenuPath] = useState('/');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const handleMenuClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveMenuPath(path);
    setShowMobileMenu(false);
  };
  
  const renderContent = () => {
    switch(activeMenuPath) {
      case '/':
        return <HomePage config={config} />;
      case '/vehicules':
        return <VehiclesPage config={config} />;
      case '/tarifs':
        return <PricingPage config={config} />;
      case '/contact':
        return <ContactPage config={config} />;
      default:
        return <HomePage config={config} />;
    }
  };
  
  return (
    <div className={`w-full ${isEditing ? 'bg-gray-50 border rounded' : ''}`}>
      <div className="flex flex-col min-h-[600px]">
        {/* Header */}
        <header className={`py-4 px-6`} style={{ backgroundColor: config.headerBackground || '#ffffff' }}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              {config.logo && (
                <img src={config.logo} alt="Logo" className="h-10 mr-3" />
              )}
              <div>
                <h1 className="font-bold text-xl">{config.title}</h1>
                <p className="text-sm text-gray-600">{config.subtitle}</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-6">
              {config.menuItems
                .filter(item => item.isActive !== false)
                .map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    className={`text-sm font-medium transition-colors hover:text-primary ${activeMenuPath === item.url ? 'text-primary font-bold' : 'text-gray-700'}`}
                    onClick={(e) => handleMenuClick(item.url, e)}
                    style={{ color: activeMenuPath === item.url ? config.primaryColor : undefined }}
                  >
                    {item.label}
                  </a>
                ))}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showMobileMenu ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 px-4 py-3 bg-gray-50 rounded-lg">
              {config.menuItems
                .filter(item => item.isActive !== false)
                .map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    className={`block py-2 text-sm font-medium ${activeMenuPath === item.url ? 'font-bold' : 'text-gray-700'}`}
                    onClick={(e) => handleMenuClick(item.url, e)}
                    style={{ color: activeMenuPath === item.url ? config.primaryColor : undefined }}
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          )}
        </header>
        
        {/* Banner if enabled */}
        {config.banner?.enabled && (
          <div 
            className="py-2 px-4 text-center text-sm"
            style={{ 
              backgroundColor: config.banner.background,
              color: config.banner.textColor
            }}
          >
            {config.banner.text}
            {config.banner.link && (
              <a href={config.banner.link} className="underline ml-2">En savoir plus</a>
            )}
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-grow">
          {renderContent()}
        </main>
        
        {/* Footer */}
        <footer className="py-8 px-6" style={{ backgroundColor: config.footerBackground || '#f5f5f5' }}>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <p className="text-sm">{config.contactInfo.address}</p>
                <p className="text-sm mt-2">{config.contactInfo.phone}</p>
                <p className="text-sm mt-2">{config.contactInfo.email}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Liens rapides</h3>
                <ul className="space-y-2">
                  {config.menuItems
                    .filter(item => item.isActive !== false)
                    .map(item => (
                      <li key={item.id}>
                        <a 
                          href={item.url}
                          className="text-sm hover:underline"
                          onClick={(e) => handleMenuClick(item.url, e)}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Suivez-nous</h3>
                <div className="flex space-x-4">
                  {config.socialLinks?.facebook && (
                    <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                  )}
                  {config.socialLinks?.twitter && (
                    <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                  )}
                  {config.socialLinks?.instagram && (
                    <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {config.title}. Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Page components
const HomePage = ({ config }: { config: WebBookingConfig }) => (
  <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor }}>Bienvenue sur {config.title}</h2>
    <p className="text-gray-700 leading-relaxed">
      Découvrez notre large gamme de véhicules disponibles à la location. Que vous ayez besoin d'une voiture compacte pour la ville ou d'un véhicule spacieux pour vos voyages en famille, nous avons ce qu'il vous faut.
    </p>
    {config.bannerConfig?.backgroundImage && (
      <div className="relative mt-8 rounded-lg overflow-hidden">
        <img
          src={config.bannerConfig.backgroundImage}
          alt={config.bannerConfig.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black" style={{ opacity: config.bannerConfig.overlayOpacity ? config.bannerConfig.overlayOpacity / 100 : 0.5 }} />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">{config.bannerConfig.title}</h3>
            <p className="text-lg">{config.bannerConfig.subtitle}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const VehiclesPage = ({ config }: { config: WebBookingConfig }) => (
  <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor }}>Nos Véhicules</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Mock Vehicle Cards */}
      <div className="border rounded-lg overflow-hidden shadow-md">
        <img src="https://via.placeholder.com/400x200" alt="Vehicle" className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg">Compacte</h3>
          <p className="text-sm text-gray-600">Idéale pour la ville</p>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-md">
        <img src="https://via.placeholder.com/400x200" alt="Vehicle" className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg">Familiale</h3>
          <p className="text-sm text-gray-600">Spacieuse et confortable</p>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-md">
        <img src="https://via.placeholder.com/400x200" alt="Vehicle" className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg">Utilitaire</h3>
          <p className="text-sm text-gray-600">Pour vos besoins professionnels</p>
        </div>
      </div>
    </div>
  </div>
);

const PricingPage = ({ config }: { config: WebBookingConfig }) => (
  <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor }}>Tarifs</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Mock Pricing Cards */}
      <div className="border rounded-lg overflow-hidden shadow-md">
        <div className="p-4">
          <h3 className="font-semibold text-lg">Compacte</h3>
          <p className="text-2xl font-bold">{config.primaryColor && <span style={{ color: config.primaryColor }}>35€</span>}/jour</p>
          <ul className="mt-4 space-y-2">
            <li className="text-sm text-gray-600">Kilométrage illimité</li>
            <li className="text-sm text-gray-600">Assurance incluse</li>
          </ul>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-md">
        <div className="p-4">
          <h3 className="font-semibold text-lg">Familiale</h3>
          <p className="text-2xl font-bold">{config.primaryColor && <span style={{ color: config.primaryColor }}>55€</span>}/jour</p>
          <ul className="mt-4 space-y-2">
            <li className="text-sm text-gray-600">Kilométrage illimité</li>
            <li className="text-sm text-gray-600">Siège enfant offert</li>
          </ul>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-md">
        <div className="p-4">
          <h3 className="font-semibold text-lg">Utilitaire</h3>
          <p className="text-2xl font-bold">{config.primaryColor && <span style={{ color: config.primaryColor }}>75€</span>}/jour</p>
          <ul className="mt-4 space-y-2">
            <li className="text-sm text-gray-600">200km inclus</li>
            <li className="text-sm text-gray-600">Assistance 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = ({ config }: { config: WebBookingConfig }) => (
  <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor }}>Contactez-nous</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <p className="text-gray-700 leading-relaxed mb-4">
          N'hésitez pas à nous contacter pour toute question ou demande de réservation.
        </p>
        <ul className="space-y-2">
          <li className="text-gray-700">
            <strong>Adresse:</strong> {config.contactInfo.address}
          </li>
          <li className="text-gray-700">
            <strong>Téléphone:</strong> {config.contactInfo.phone}
          </li>
          <li className="text-gray-700">
            <strong>Email:</strong> {config.contactInfo.email}
          </li>
        </ul>
      </div>
      <div>
        {/* Mock Contact Form */}
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Formulaire de contact</h3>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" id="name" className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" rows={4} className="mt-1 p-2 w-full border rounded-md"></textarea>
            </div>
            <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md" style={{ backgroundColor: config.primaryColor }}>Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default WebBookingPreview;
