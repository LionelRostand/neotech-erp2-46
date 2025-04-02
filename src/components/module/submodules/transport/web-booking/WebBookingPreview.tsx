
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Car, Calendar, MessageSquare, Home, Trash2, Edit3, Move, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WebBookingConfig } from '../types';

interface WebBookingPreviewProps {
  isEditing: boolean;
}

interface SectionProps {
  id: string;
  children: React.ReactNode;
  title?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  isEditing: boolean;
  index: number;
  moveSection?: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableSection: React.FC<SectionProps> = ({ 
  id, 
  children, 
  title, 
  onRemove, 
  onEdit, 
  isEditing, 
  index, 
  moveSection 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SECTION',
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index && moveSection) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div 
      ref={(node) => isEditing ? drag(drop(node)) : null}
      className={`relative rounded-lg mb-4 ${isDragging ? 'opacity-50' : 'opacity-100'} ${isEditing ? 'border border-dashed border-gray-300 hover:border-primary' : ''}`}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          {title && <div className="bg-muted/80 px-2 py-1 text-xs rounded">{title}</div>}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-6 w-6">
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
          {onRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove} className="h-6 w-6 text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6 cursor-move">
            <Move className="h-3 w-3" />
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};

const WebBookingPreview: React.FC<WebBookingPreviewProps> = ({ isEditing }) => {
  // Sample config data
  const config: WebBookingConfig = {
    siteTitle: "RentaCar - Location de véhicules",
    logo: "/logo.png",
    primaryColor: "#ff5f00",
    secondaryColor: "#003366",
    fontFamily: "Inter",
    enableBookingForm: true,
    requiredFields: ["pickup_location", "dropoff_location", "pickup_date", "dropoff_date"]
  };
  
  // Sections state for each tab
  const [homeSections, setHomeSections] = useState([{ id: 'home-main', component: 'hero' }]);
  const [servicesSections, setServicesSections] = useState([{ id: 'services-main', component: 'services' }]);
  const [bookingSections, setBookingSections] = useState([{ id: 'booking-main', component: 'booking-form' }]);
  const [contactSections, setContactSections] = useState([
    { id: 'contact-form', component: 'contact-form' },
    { id: 'contact-info', component: 'contact-info' }
  ]);

  // Function to move sections (for drag and drop)
  const moveSection = (tabSections: any[], setSections: React.Dispatch<React.SetStateAction<any[]>>) => 
    (dragIndex: number, hoverIndex: number) => {
      const draggedSection = tabSections[dragIndex];
      const newSections = [...tabSections];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      setSections(newSections);
    };

  // Function to remove a section
  const removeSection = (tabSections: any[], setSections: React.Dispatch<React.SetStateAction<any[]>>, id: string) => {
    setSections(tabSections.filter(section => section.id !== id));
  };

  // Function to add a section
  const addSection = (tabSections: any[], setSections: React.Dispatch<React.SetStateAction<any[]>>, type: string) => {
    const newSection = { 
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`, 
      component: type 
    };
    setSections([...tabSections, newSection]);
  };

  const renderTabContent = (
    tabSections: any[], 
    setTabSections: React.Dispatch<React.SetStateAction<any[]>>,
    addSectionOptions: Array<{type: string, label: string}>
  ) => {
    return (
      <>
        {tabSections.map((section, index) => (
          <DraggableSection 
            key={section.id} 
            id={section.id}
            isEditing={isEditing}
            index={index}
            moveSection={moveSection(tabSections, setTabSections)}
            onRemove={() => removeSection(tabSections, setTabSections, section.id)}
            title={`Section ${section.component}`}
          >
            {renderSectionContent(section)}
          </DraggableSection>
        ))}

        {isEditing && (
          <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-2">Ajouter une nouvelle section</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {addSectionOptions.map(option => (
                <Button 
                  key={option.type}
                  variant="outline" 
                  size="sm"
                  onClick={() => addSection(tabSections, setTabSections, option.type)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderSectionContent = (section: { component: string }) => {
    switch(section.component) {
      case 'hero':
        return (
          <div className="relative">
            {/* Hero image */}
            <div className="w-full h-[400px] bg-gray-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-900/40 flex items-center">
                <div className="container mx-auto px-6 py-12">
                  <div className="max-w-lg">
                    <h1 className="text-4xl font-bold text-white mb-6">Louez votre véhicule au meilleur prix</h1>
                    <p className="text-xl text-white mb-8">
                      Plus de 300 agences en France et en Europe pour votre confort
                    </p>
                    
                    {/* Search form on hero */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Lieu de prise en charge</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une agence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paris">Paris</SelectItem>
                              <SelectItem value="lyon">Lyon</SelectItem>
                              <SelectItem value="marseille">Marseille</SelectItem>
                              <SelectItem value="bordeaux">Bordeaux</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date de départ</label>
                            <DatePicker />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Date de retour</label>
                            <DatePicker />
                          </div>
                        </div>
                        
                        <Button className="w-full bg-[#ff5f00] hover:bg-[#ff7c33]">
                          Rechercher un véhicule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features section */}
            <div className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">Pourquoi choisir notre service de location ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="bg-[#f2f7fc] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="h-8 w-8 text-[#003366]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Large choix de véhicules</h3>
                    <p className="text-muted-foreground">Du compact au premium, trouvez le véhicule idéal pour vos besoins</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-[#f2f7fc] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-[#003366]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Réservation flexible</h3>
                    <p className="text-muted-foreground">Modification et annulation gratuites jusqu'à 24h avant le départ</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-[#f2f7fc] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-[#003366]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Service client 7j/7</h3>
                    <p className="text-muted-foreground">Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular vehicles */}
            <div className="py-12 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">Nos véhicules populaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Citadine", price: "39", image: "bg-gray-200" },
                    { name: "SUV Compact", price: "59", image: "bg-gray-200" },
                    { name: "Berline Premium", price: "89", image: "bg-gray-200" }
                  ].map((vehicle, idx) => (
                    <div key={idx} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className={`${vehicle.image} h-48`}></div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{vehicle.name}</h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold">{vehicle.price}€</span>
                            <span className="text-sm text-muted-foreground">/jour</span>
                          </div>
                          <Button size="sm">Réserver</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-center">Nos Services de Location</h2>
            
            {/* Vehicle categories */}
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-semibold mb-6">Catégories de véhicules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Économique", desc: "Le choix idéal pour les petits budgets" },
                  { name: "Familiale", desc: "Spacieux et confortable pour les voyages en famille" },
                  { name: "Premium", desc: "Une expérience de conduite haut de gamme" },
                  { name: "Utilitaire", desc: "Pour vos déménagements et transports volumineux" }
                ].map((category, idx) => (
                  <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                    <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
                    <p className="text-muted-foreground mb-4">{category.desc}</p>
                    <Button variant="outline" size="sm">Voir les véhicules</Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional services */}
            <div className="container mx-auto px-4 py-8 bg-gray-50">
              <h3 className="text-2xl font-semibold mb-6">Services additionnels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: "Assurance tous risques", price: "12" },
                  { name: "Siège bébé/enfant", price: "8" },
                  { name: "GPS", price: "7" },
                  { name: "Conducteur additionnel", price: "10" },
                  { name: "Retour dans une autre agence", price: "50" },
                  { name: "Plein d'essence", price: "varies" }
                ].map((service, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-b">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-muted-foreground">à partir de {service.price}€</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Customer testimonials */}
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-semibold mb-6 text-center">Ce que disent nos clients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Marie D.", text: "Excellent service, véhicule impeccable et personnel très accueillant." },
                  { name: "Jean M.", text: "Processus de réservation simple et efficace. Je recommande vivement." },
                  { name: "Sophie L.", text: "Rapport qualité/prix imbattable. Je loue régulièrement chez eux." }
                ].map((testimonial, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="italic mb-4">"{testimonial.text}"</p>
                    <p className="font-bold text-sm">- {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'booking-form':
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Réservez votre véhicule</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">1. Lieu et dates</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Lieu de prise en charge</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une agence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paris">Paris</SelectItem>
                              <SelectItem value="lyon">Lyon</SelectItem>
                              <SelectItem value="marseille">Marseille</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Lieu de restitution</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Idem prise en charge" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="same">Idem prise en charge</SelectItem>
                              <SelectItem value="paris">Paris</SelectItem>
                              <SelectItem value="lyon">Lyon</SelectItem>
                              <SelectItem value="marseille">Marseille</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date départ</label>
                            <DatePicker />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Heure départ</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="09:00" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(24)].map((_, i) => (
                                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {i.toString().padStart(2, '0')}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date retour</label>
                            <DatePicker />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Heure retour</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="18:00" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(24)].map((_, i) => (
                                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {i.toString().padStart(2, '0')}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">2. Sélectionnez votre catégorie</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { name: "Économique", price: "39" },
                          { name: "Compacte", price: "49" },
                          { name: "Intermédiaire", price: "59" },
                          { name: "Berline", price: "79" }
                        ].map((category, idx) => (
                          <div key={idx} className="border rounded p-4 cursor-pointer hover:border-[#ff5f00] transition-colors">
                            <div className="h-20 bg-gray-100 mb-2"></div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">à partir de {category.price}€/jour</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">3. Options</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>Assurance tous risques</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">12€/jour</span>
                            <input type="checkbox" className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>GPS</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">7€/jour</span>
                            <input type="checkbox" className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>Siège enfant</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">8€/jour</span>
                            <input type="checkbox" className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">4. Coordonnées</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Prénom</label>
                            <Input placeholder="Votre prénom" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <Input placeholder="Votre nom" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input type="email" placeholder="votre@email.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Téléphone</label>
                          <Input placeholder="Votre numéro de téléphone" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Récapitulatif</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Location véhicule</span>
                          <span>195€</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Options</span>
                          <span>0€</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>195€</span>
                        </div>
                      </div>
                      <Button className="w-full bg-[#ff5f00] hover:bg-[#ff7c33]">
                        Réserver maintenant
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact-form':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Contactez-nous</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom</label>
                      <Input placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input type="email" placeholder="votre@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sujet</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reservation">Question sur une réservation</SelectItem>
                          <SelectItem value="vehicule">Information sur les véhicules</SelectItem>
                          <SelectItem value="tarifs">Demande de tarifs</SelectItem>
                          <SelectItem value="autre">Autre demande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        className="w-full h-32 p-3 border rounded-md resize-none" 
                        placeholder="Votre message"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-[#ff5f00] hover:bg-[#ff7c33]">Envoyer</Button>
                  </form>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Nos coordonnées</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Siège social</p>
                      <p className="text-muted-foreground">123 Avenue de la République, 75011 Paris</p>
                    </div>
                    <div>
                      <p className="font-medium">Service client</p>
                      <p className="text-muted-foreground">0800 123 456 (appel gratuit)</p>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">contact@rentacar.fr</p>
                    </div>
                    <div>
                      <p className="font-medium">Heures d'ouverture</p>
                      <p className="text-muted-foreground">Lun-Ven: 8h-20h | Sam: 9h-18h | Dim: 10h-16h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact-info':
        return (
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
        );
      default:
        return <div>Section non reconnue</div>;
    }
  };

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
        <DndProvider backend={HTML5Backend}>
          {/* Header with Rentacar-like style */}
          <header className="bg-white shadow-sm py-4 mb-6">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="text-xl font-bold text-[#003366]">{config.siteTitle}</div>
              <nav>
                <ul className="hidden md:flex items-center gap-6">
                  <li className="hover:text-[#ff5f00] cursor-pointer">Accueil</li>
                  <li className="hover:text-[#ff5f00] cursor-pointer">Services</li>
                  <li className="hover:text-[#ff5f00] cursor-pointer">Véhicules</li>
                  <li className="hover:text-[#ff5f00] cursor-pointer">Tarifs</li>
                  <li className="hover:text-[#ff5f00] cursor-pointer">Contact</li>
                  <li><Button size="sm" variant="outline">Connexion</Button></li>
                  <li><Button size="sm" className="bg-[#ff5f00] hover:bg-[#ff7c33]">Réserver</Button></li>
                </ul>
              </nav>
            </div>
          </header>
            
          <Tabs defaultValue="home" className="w-full">
            <div className="border-b mb-6">
              <div className="max-w-screen-lg mx-auto">
                <TabsList className="bg-transparent justify-center">
                  <TabsTrigger value="home" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff5f00] data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <Home className="w-4 h-4 mr-2" />
                    Accueil
                  </TabsTrigger>
                  <TabsTrigger value="services" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff5f00] data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <Car className="w-4 h-4 mr-2" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="booking" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff5f00] data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Réservation
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff5f00] data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="max-w-screen-lg mx-auto">
              <TabsContent value="home">
                {renderTabContent(
                  homeSections, 
                  setHomeSections,
                  [{ type: 'hero', label: 'Hero Section' }]
                )}
              </TabsContent>
              
              <TabsContent value="services">
                {renderTabContent(
                  servicesSections, 
                  setServicesSections,
                  [{ type: 'services', label: 'Services' }]
                )}
              </TabsContent>
              
              <TabsContent value="booking">
                {renderTabContent(
                  bookingSections, 
                  setBookingSections,
                  [{ type: 'booking-form', label: 'Formulaire' }]
                )}
              </TabsContent>
              
              <TabsContent value="contact">
                {renderTabContent(
                  contactSections, 
                  setContactSections,
                  [
                    { type: 'contact-form', label: 'Formulaire' },
                    { type: 'contact-info', label: 'Informations' }
                  ]
                )}
              </TabsContent>
            </div>
          </Tabs>
          
          {/* Footer */}
          <footer className="bg-[#003366] text-white mt-12 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">RentaCar</h4>
                  <p className="text-sm opacity-80">
                    Location de véhicules pour particuliers et professionnels dans toute la France.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Liens utiles</h4>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>À propos de nous</li>
                    <li>Conditions générales</li>
                    <li>Politique de confidentialité</li>
                    <li>FAQ</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Nos services</h4>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>Location courte durée</li>
                    <li>Location longue durée</li>
                    <li>Location avec chauffeur</li>
                    <li>Services aux entreprises</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact</h4>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>0800 123 456</li>
                    <li>contact@rentacar.fr</li>
                    <li>123 Avenue de la République, 75011 Paris</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-70">
                © 2023 RentaCar. Tous droits réservés.
              </div>
            </div>
          </footer>
        </DndProvider>
      </div>
    </div>
  );
};

export default WebBookingPreview;
