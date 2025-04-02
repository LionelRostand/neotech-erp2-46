
import React, { useState } from 'react';
import TransportBookingTemplate from '../../website/templates/TransportBookingTemplate';
import CustomerContactForm from './CustomerContactForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Car, Calendar, MessageSquare, Home, Trash2, Edit3, Move, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  // Sections state for each tab
  const [homeSections, setHomeSections] = useState([{ id: 'home-main', component: 'template' }]);
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
      case 'template':
        return <TransportBookingTemplate isEditable={isEditing} />;
      case 'services':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Nos Services de Transport</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["VTC", "Navette Aéroport", "Location avec Chauffeur"].map((service, index) => (
                <div key={index} className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium mb-2">{service}</h3>
                  <p className="text-muted-foreground">
                    Description détaillée du service de transport proposé à nos clients.
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'booking-form':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Réservez votre trajet</h2>
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <p className="text-center text-muted-foreground mb-6">
                Formulaire de réservation en cours d'élaboration
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse de départ</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="Saisissez l'adresse de départ" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse d'arrivée</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="Saisissez l'adresse d'arrivée" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure</label>
                  <input type="time" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="text-center">
                <button className="bg-primary text-white px-4 py-2 rounded">Vérifier la disponibilité</button>
              </div>
            </div>
          </div>
        );
      case 'contact-form':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Contactez-nous</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <CustomerContactForm isEditable={isEditing} />
              </div>
              <div></div>
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
          <Tabs defaultValue="home" className="w-full">
            <div className="border-b mb-6">
              <div className="max-w-screen-lg mx-auto">
                <TabsList className="bg-transparent justify-center">
                  <TabsTrigger value="home" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <Home className="w-4 h-4 mr-2" />
                    Accueil
                  </TabsTrigger>
                  <TabsTrigger value="services" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <Car className="w-4 h-4 mr-2" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="booking" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Réservation
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
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
                  [{ type: 'template', label: 'Template' }]
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
        </DndProvider>
      </div>
    </div>
  );
};

export default WebBookingPreview;
