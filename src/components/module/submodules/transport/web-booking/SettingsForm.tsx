import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WebBookingConfig, MenuItem, BannerConfigExtended } from '../types';
import { useToast } from '@/hooks/use-toast';
import MenuEditor from './MenuEditor';
import BannerEditor from './BannerEditor';

const SettingsForm = () => {
  const { toast } = useToast();

  // Sample initial config
  const [config, setConfig] = React.useState<WebBookingConfig>({
    title: "RentaCar - Location de véhicules",
    subtitle: "Location de véhicules de qualité",
    logo: "/logo.png",
    primaryColor: "#ff5f00",
    secondaryColor: "#003366",
    fontFamily: "Inter",
    headerBackground: "#ffffff",
    footerBackground: "#f5f5f5",
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
    siteTitle: "RentaCar - Location de véhicules",
    enableBookingForm: true,
    requiredFields: ["pickup_location", "dropoff_location", "pickup_date", "dropoff_date"],
    menuItems: [
      { id: '1', label: 'Accueil', url: '/', isExternal: false, isActive: true },
      { id: '2', label: 'Nos Véhicules', url: '/vehicules', isExternal: false, isActive: true },
      { id: '3', label: 'Tarifs', url: '/tarifs', isExternal: false, isActive: true },
      { id: '4', label: 'Contact', url: '/contact', isExternal: false, isActive: true },
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
  });

  const handleChange = (field: keyof WebBookingConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequiredFieldToggle = (field: string) => {
    setConfig(prev => {
      const fields = [...(prev.requiredFields || [])];
      
      if (fields.includes(field)) {
        return {
          ...prev,
          requiredFields: fields.filter(f => f !== field)
        };
      } else {
        return {
          ...prev,
          requiredFields: [...fields, field]
        };
      }
    });
  };

  const handleMenuChange = (items: MenuItem[]) => {
    handleChange('menuItems', items);
  };

  const handleBannerChange = (bannerConfig: BannerConfigExtended) => {
    handleChange('bannerConfig', bannerConfig);
  };

  const handleSave = () => {
    // In a real application, this would save to a backend
    console.log("Saving configuration:", config);
    
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres du site ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="banner">Bannière</TabsTrigger>
          <TabsTrigger value="booking">Réservation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres généraux</h3>
            <div>
              <Label htmlFor="site-title">Titre du site</Label>
              <Input 
                id="site-title" 
                value={config.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="logo">Logo (URL)</Label>
              <div className="flex mt-1">
                <Input 
                  id="logo" 
                  value={config.logo || ''}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  className="flex-1" 
                />
                <Button variant="outline" className="ml-2">Parcourir</Button>
              </div>
              {config.logo && (
                <div className="mt-2 p-2 border rounded inline-block">
                  <img 
                    src={config.logo} 
                    alt="Logo preview" 
                    className="h-10 w-auto" 
                    onError={(e) => e.currentTarget.style.display = 'none'} 
                  />
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="font-family">Police de caractères</Label>
              <select 
                id="font-family" 
                value={config.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Apparence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex mt-1 items-center gap-2">
                  <input 
                    type="color" 
                    id="primary-color" 
                    value={config.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-10 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={config.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1" 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary-color">Couleur secondaire</Label>
                <div className="flex mt-1 items-center gap-2">
                  <input 
                    type="color" 
                    id="secondary-color" 
                    value={config.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={config.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="flex-1" 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Aperçu des couleurs</h4>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="h-20 rounded flex items-center justify-center text-white" 
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Couleur principale
                </div>
                <div 
                  className="h-20 rounded flex items-center justify-center text-white" 
                  style={{ backgroundColor: config.secondaryColor }}
                >
                  Couleur secondaire
                </div>
                <div className="col-span-2">
                  <div 
                    className="p-4 rounded border" 
                    style={{ backgroundColor: 'white' }}
                  >
                    <h5 className="font-medium mb-2" style={{ color: config.secondaryColor }}>Titre d'exemple</h5>
                    <p className="text-sm mb-3">Texte d'exemple pour voir le rendu des couleurs.</p>
                    <button 
                      className="px-4 py-2 rounded text-white" 
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Bouton d'exemple
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6 mt-6">
          <MenuEditor 
            initialMenuItems={config.menuItems} 
            onMenuChange={handleMenuChange} 
          />
        </TabsContent>

        <TabsContent value="banner" className="space-y-6 mt-6">
          <BannerEditor 
            initialConfig={config.bannerConfig} 
            onConfigChange={handleBannerChange}
          />
        </TabsContent>
        
        <TabsContent value="booking" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres de réservation</h3>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="enable-booking" 
                checked={config.enableBookingForm}
                onCheckedChange={(checked) => handleChange('enableBookingForm', checked)}
              />
              <Label htmlFor="enable-booking">Activer le formulaire de réservation</Label>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Champs obligatoires</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="req-pickup-location" 
                    checked={config.requiredFields.includes('pickup_location')}
                    onCheckedChange={() => handleRequiredFieldToggle('pickup_location')}
                  />
                  <Label htmlFor="req-pickup-location">Lieu de départ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="req-dropoff-location" 
                    checked={config.requiredFields.includes('dropoff_location')}
                    onCheckedChange={() => handleRequiredFieldToggle('dropoff_location')}
                  />
                  <Label htmlFor="req-dropoff-location">Lieu de retour</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="req-pickup-date" 
                    checked={config.requiredFields.includes('pickup_date')}
                    onCheckedChange={() => handleRequiredFieldToggle('pickup_date')}
                  />
                  <Label htmlFor="req-pickup-date">Date de départ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="req-dropoff-date" 
                    checked={config.requiredFields.includes('dropoff_date')}
                    onCheckedChange={() => handleRequiredFieldToggle('dropoff_date')}
                  />
                  <Label htmlFor="req-dropoff-date">Date de retour</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="req-driver-info" 
                    checked={config.requiredFields.includes('driver_info')}
                    onCheckedChange={() => handleRequiredFieldToggle('driver_info')}
                  />
                  <Label htmlFor="req-driver-info">Informations du conducteur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="req-phone" 
                    checked={config.requiredFields.includes('phone')}
                    onCheckedChange={() => handleRequiredFieldToggle('phone')}
                  />
                  <Label htmlFor="req-phone">Téléphone</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};

export default SettingsForm;
