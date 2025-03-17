
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Grid2X2, Download, Trash2, Check } from 'lucide-react';
import { modules } from '@/data/appModules';

const Applications = () => {
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  
  // Charger les modules installés depuis le localStorage au chargement
  useEffect(() => {
    const savedModules = localStorage.getItem('installedModules');
    if (savedModules) {
      setInstalledModules(JSON.parse(savedModules));
    }
  }, []);
  
  // Sauvegarder les modules installés dans le localStorage
  useEffect(() => {
    localStorage.setItem('installedModules', JSON.stringify(installedModules));
    // Déclencher un événement personnalisé pour notifier le DashboardLayout
    const event = new CustomEvent('modulesChanged', { detail: installedModules });
    window.dispatchEvent(event);
  }, [installedModules]);
  
  const handleInstall = (moduleId: number) => {
    if (!installedModules.includes(moduleId)) {
      const newInstalledModules = [...installedModules, moduleId];
      setInstalledModules(newInstalledModules);
      
      const module = modules.find(m => m.id === moduleId);
      toast({
        title: "Module installé",
        description: `${module?.name} a été installé avec succès.`,
        variant: "default",
      });
    }
  };
  
  const handleUninstall = (moduleId: number) => {
    const newInstalledModules = installedModules.filter(id => id !== moduleId);
    setInstalledModules(newInstalledModules);
    
    const module = modules.find(m => m.id === moduleId);
    toast({
      title: "Module désinstallé",
      description: `${module?.name} a été désinstallé.`,
      variant: "default",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">APPLICATIONS</h1>
        <p className="text-gray-600 mb-8">
          Explorez et gérez les modules disponibles pour votre système NEOTECH-ERP.
          Installez les modules dont vous avez besoin et personnalisez votre expérience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden border border-gray-200 transition-all hover:shadow-md">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-neotech-primary/10 text-neotech-primary">
                    {module.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription className="text-xs">Module #{module.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600">{module.description}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-between">
                {installedModules.includes(module.id) ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-green-600" disabled>
                      <Check className="mr-1 h-4 w-4" />
                      Installé
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleUninstall(module.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Désinstaller
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => handleInstall(module.id)}
                    className="hover:bg-neotech-primary hover:text-white"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Installer
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Applications;
