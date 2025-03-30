
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Check, ArrowRight, Car, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Type pour les modules intégrables
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
];

const WebsiteModules: React.FC = () => {
  const [modules, setModules] = useState<IntegrableModule[]>(INTEGRABLE_MODULES);
  const [showIntegrateDialog, setShowIntegrateDialog] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<IntegrableModule | null>(null);
  
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
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modules disponibles</CardTitle>
          <CardDescription>
            Intégrez d'autres modules pour ajouter des fonctionnalités à votre site web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Aucun module disponible pour l'intégration.</p>
              </div>
            ) : (
              modules.map(module => (
                <div 
                  key={module.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-2 rounded-full">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="font-medium flex items-center">
                        {module.name}
                        {module.status === 'integrated' && (
                          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                            Intégré
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    {module.status === 'not-installed' ? (
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/applications'}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Installer
                      </Button>
                    ) : module.status === 'installed' ? (
                      <Button 
                        onClick={() => handleIntegrateModule(module)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Intégrer
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            if (module.id === 'transport') {
                              window.location.href = '/modules/transport/web-booking';
                            }
                          }}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Configurer
                        </Button>
                        <Button 
                          variant="outline" 
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
                  </div>
                </div>
              ))
            )}
          </div>
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
    </div>
  );
};

export default WebsiteModules;
