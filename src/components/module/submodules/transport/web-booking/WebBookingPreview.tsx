
import React from 'react';
import { WebBookingConfig } from '../types/web-booking-types';

interface WebBookingPreviewProps {
  isEditing: boolean;
  config: WebBookingConfig;
}

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ isEditing, config }) => {
  const { 
    siteTitle, 
    title, 
    subtitle, 
    logo, 
    primaryColor, 
    secondaryColor, 
    bannerConfig, 
    menuItems,
    contactInfo
  } = config;

  // Generate inline styles for preview
  const headerStyle = {
    backgroundColor: config.headerBackground || '#ffffff',
    borderBottom: '1px solid rgba(0,0,0,0.1)'
  };

  const bannerStyle = {
    backgroundColor: bannerConfig?.backgroundColor || '#003366',
    color: bannerConfig?.textColor || '#ffffff',
    backgroundImage: bannerConfig?.backgroundImage ? `url(${bannerConfig.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as 'relative'
  };

  const overlayStyle = {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,' + (bannerConfig?.overlayOpacity || 50) / 100 + ')',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative' as 'relative',
    zIndex: 2,
    padding: '3rem 1.5rem'
  };

  const buttonStyle = {
    backgroundColor: primaryColor,
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    fontWeight: 600,
    display: 'inline-block',
    marginTop: '1rem',
    cursor: 'pointer'
  };

  const footerStyle = {
    backgroundColor: config.footerBackground || '#f5f5f5'
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-md overflow-hidden border">
      {/* Header */}
      <header style={headerStyle} className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {logo && (
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            )}
            <h1 className="font-bold text-xl">{siteTitle || title}</h1>
          </div>
          
          <nav>
            <ul className="flex gap-6">
              {menuItems?.map(item => (
                <li key={item.id} className={`${item.isActive ? 'font-semibold' : ''}`}>
                  <a href={item.url} style={{ color: item.isActive ? primaryColor : 'inherit' }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Banner */}
      {bannerConfig && (
        <div style={bannerStyle} className="relative text-center">
          {bannerConfig.overlay && <div style={overlayStyle}></div>}
          <div style={contentStyle}>
            <h2 className="text-3xl font-bold mb-2">{bannerConfig.title || title}</h2>
            <p className="text-xl mb-4">{bannerConfig.subtitle || subtitle}</p>
            {bannerConfig.buttonText && (
              <a href={bannerConfig.buttonLink || '#'} style={buttonStyle}>
                {bannerConfig.buttonText}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Booking Form Section */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ color: secondaryColor }} className="text-2xl font-bold mb-6">Réservez votre véhicule en quelques clics</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Formulaire de réservation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Lieu de prise en charge</label>
                    <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Aéroport, gare, adresse..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lieu de retour</label>
                    <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Même adresse que la prise en charge" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date de départ</label>
                      <input type="date" className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure</label>
                      <input type="time" className="w-full px-3 py-2 border rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date de retour</label>
                      <input type="date" className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure</label>
                      <input type="time" className="w-full px-3 py-2 border rounded" />
                    </div>
                  </div>
                  
                  <button type="submit" style={{ backgroundColor: primaryColor }} className="w-full py-2 px-4 text-white rounded">
                    Rechercher un véhicule
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Nos services</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Annulation gratuite jusqu'à 48h avant la prise en charge</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Kilométrage illimité sur tous nos véhicules</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Assistance 24h/24 et 7j/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Véhicules récents et bien entretenus</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Besoin d'aide ?</h4>
                <p className="text-sm text-gray-600 mb-2">Notre équipe est disponible pour vous aider dans votre réservation</p>
                <div className="text-sm">
                  <p><strong>Téléphone :</strong> {contactInfo?.phone}</p>
                  <p><strong>Email :</strong> {contactInfo?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle} className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{siteTitle || title}</h3>
              <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
              <p className="text-sm">{contactInfo?.address}</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                {menuItems?.map(item => (
                  <li key={item.id}>
                    <a href={item.url} className="text-sm hover:underline">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Téléphone : {contactInfo?.phone}</li>
                <li>Email : {contactInfo?.email}</li>
                <li>Adresse : {contactInfo?.address}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-sm text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} {siteTitle || title}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebBookingPreview;
