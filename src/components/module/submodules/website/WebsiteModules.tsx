
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Puzzle, 
  Plus, 
  ExternalLink, 
  Check, 
  ArrowRight, 
  Car, 
  Trash2, 
  X, 
  Search, 
  Settings, 
  ShoppingCart, 
  MessageSquare, 
  Calendar,
  Utensils,
  Scissors
} from 'lucide-react';

// Types pour les modules intégrables
interface IntegrableModule {
  id: string;
  moduleId: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'installed' | 'not-installed' | 'integrated';
}

// Liste des modules intégrables
const INTEGRABLE_MODULES: IntegrableModule[] = [
  {
    id: 'transport',
    moduleId: 7,
    name: 'Transport',
    icon: <Car className="h-5 w-5" />,
    description: 'Intégrez un système de réservation de transport sur votre site web',
    status: 'installed'
  },
  {
    id: 'restaurant',
    moduleId: 8,
    name: 'Restauration',
    icon: <Utensils className="h-5 w-5" />,
    description: 'Intégrez les réservations de table pour votre restaurant',
    status: 'installed'
  },
  {
    id: 'salon',
    moduleId: 9,
    name: 'Salon',
    icon: <Scissors className="h-5 w-5" />,
    description: 'Intégrez les réservations pour votre salon de beauté',
    status: 'installed'
  },
  {
    id: 'ecommerce',
    moduleId: 12,
    name: 'E-commerce',
    icon: <ShoppingCart className="h-5 w-5" />,
    description: 'Ajoutez une boutique en ligne à votre site web',
    status: 'not-installed'
  },
  {
    id: 'blog',
    moduleId: 13,
    name: 'Blog',
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Partagez du contenu et des actualités sur votre site web',
    status: 'not-installed'
  },
  {
    id: 'events',
    moduleId: 14,
    name: 'Évènements',
    icon: <Calendar className="h-5 w-5" />,
    description: 'Gérez des événements et vendez des billets en ligne',
    status: 'not-installed'
  }
];

const WebsiteModules: React.FC = () => {
  const [modules, setModules] = useState<IntegrableModule[]>(INTEGRABLE_MODULES);
  const [showIntegrateDialog, setShowIntegrateDialog] = useState<boolean>(false);
  const [showAddModuleDialog, setShowAddModuleDialog] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<IntegrableModule | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filtrer les modules en fonction de la recherche et de l'onglet actif
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
                         
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'integrated') return matchesSearch && module.status === 'integrated';
    if (activeTab === 'available') return matchesSearch && module.status === 'installed';
    
    return matchesSearch;
  });
  
  // Gestionnaire pour l'intégration d'un module
  const handleIntegrateModule = (module: IntegrableModule) => {
    setSelectedModule(module);
    setShowIntegrateDialog(true);
  };
  
  // Gestionnaire pour la confirmation de l'intégration
  const handleConfirmIntegration = () => {
    if (selectedModule) {
      // Mettre à jour l'état du module
      setModules(modules.map(m => 
        m.id === selectedModule.id 
          ? { ...m, status: 'integrated' } 
          : m
      ));
      
      // Fermer le dialogue
      setShowIntegrateDialog(false);
      
      // Naviguer vers la page d'intégration du module
      if (selectedModule.id === 'transport') {
        window.location.href = '/modules/transport/web-booking';
      } else if (selectedModule.id === 'restaurant') {
        window.location.href = '/modules/restaurant/web-integration';
      } else if (selectedModule.id === 'salon') {
        window.location.href = '/modules/salon/web-integration';
      }
    }
  };
  
  // Gestionnaire pour l'ajout d'un nouveau module
  const handleAddModule = () => {
    // Simuler l'installation d'un nouveau module
    const notInstalledModule = modules.find(m => m.status === 'not-installed');
    
    if (notInstalledModule) {
      setModules(modules.map(m => 
        m.id === notInstalledModule.id 
          ? { ...m, status: 'installed' } 
          : m
      ));
    }
    
    setShowAddModuleDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Modules du site web</h2>
      <p className="mt-2 text-muted-foreground">Intégrez d'autres modules à votre site web pour enrichir ses fonctionnalités.</p>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un module..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="integrated">Intégrés</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.length === 0 ? (
          <div className="col-span-3 p-8 text-center border rounded-lg">
            <Puzzle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Aucun module trouvé</p>
            <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou parcourez la liste complète des modules disponibles.</p>
          </div>
        ) : (
          filteredModules.map(module => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      {module.name}
                      {module.status === 'integrated' && (
                        <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                          Intégré
                        </Badge>
                      )}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                <div className="flex space-x-2">
                  {module.status === 'not-installed' ? (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.location.href = '/applications'}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Installer
                    </Button>
                  ) : module.status === 'installed' ? (
                    <Button 
                      className="flex-1"
                      onClick={() => handleIntegrateModule(module)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Intégrer
                    </Button>
                  ) : (
                    <div className="flex space-x-2 w-full">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if (module.id === 'transport') {
                            window.location.href = '/modules/transport/web-booking';
                          } else if (module.id === 'restaurant') {
                            window.location.href = '/modules/restaurant/web-integration';
                          } else if (module.id === 'salon') {
                            window.location.href = '/modules/salon/web-integration';
                          }
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurer
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-none"
                        onClick={() => {
                          setModules(modules.map(m => 
                            m.id === module.id 
                              ? { ...m, status: 'installed' } 
                              : m
                          ));
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau module</CardTitle>
          <CardDescription>Vous pouvez ajouter d'autres modules pour étendre les fonctionnalités de votre site web.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowAddModuleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un module
          </Button>
        </CardContent>
      </Card>
      
      {/* Dialogue de confirmation d'intégration */}
      <Dialog open={showIntegrateDialog} onOpenChange={setShowIntegrateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Intégrer le module {selectedModule?.name}</DialogTitle>
            <DialogDescription>
              Cette action va intégrer le module {selectedModule?.name} à votre site web. 
              Vous pourrez ensuite configurer l'intégration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowIntegrateDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleConfirmIntegration}>
              <Check className="h-4 w-4 mr-2" />
              Confirmer l'intégration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'ajout de nouveau module */}
      <Dialog open={showAddModuleDialog} onOpenChange={setShowAddModuleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau module</DialogTitle>
            <DialogDescription>
              Sélectionnez un module à ajouter à votre site web.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un module..."
                className="pl-8"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
              {modules
                .filter(m => m.status === 'not-installed')
                .map(module => (
                  <Card key={module.id} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          {module.icon}
                        </div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModuleDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddModule}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le module sélectionné
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteModules;
