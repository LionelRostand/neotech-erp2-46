
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ModuleList from '@/components/applications/ModuleList';
import { modules } from '@/data/modules';
import PageHeader from '@/components/applications/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ApplicationsPage = () => {
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [configCompletedModules, setConfigCompletedModules] = useState<number[]>([]);
  
  // Charger les modules installés depuis le localStorage
  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      const savedConfigCompleted = localStorage.getItem('configCompletedModules');
      
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
      
      if (savedConfigCompleted) {
        setConfigCompletedModules(JSON.parse(savedConfigCompleted));
      }
    };
    
    loadInstalledModules();
  }, []);
  
  // Filtrer les modules en fonction de la recherche et de la catégorie
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Gérer l'installation d'un module
  const handleInstallModule = (moduleId: number) => {
    // Vérifier si le module n'est pas déjà installé
    if (!installedModules.includes(moduleId)) {
      const updatedModules = [...installedModules, moduleId];
      setInstalledModules(updatedModules);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('installedModules', JSON.stringify(updatedModules));
      
      // Déclencher un événement personnalisé pour informer les autres composants
      window.dispatchEvent(new CustomEvent('modulesChanged'));
      
      toast.success(`Module installé avec succès`, {
        description: `Le module ${modules.find(m => m.id === moduleId)?.name} a été installé.`
      });
    }
  };
  
  // Gérer la désinstallation d'un module
  const handleUninstallModule = (moduleId: number) => {
    const updatedModules = installedModules.filter(id => id !== moduleId);
    setInstalledModules(updatedModules);
    
    // Retirer également de la liste des modules configurés
    const updatedConfigCompleted = configCompletedModules.filter(id => id !== moduleId);
    setConfigCompletedModules(updatedConfigCompleted);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('installedModules', JSON.stringify(updatedModules));
    localStorage.setItem('configCompletedModules', JSON.stringify(updatedConfigCompleted));
    
    // Déclencher un événement personnalisé pour informer les autres composants
    window.dispatchEvent(new CustomEvent('modulesChanged'));
    
    toast.success(`Module désinstallé`, {
      description: `Le module ${modules.find(m => m.id === moduleId)?.name} a été désinstallé.`
    });
  };
  
  // Gérer l'expansion d'un module
  const handleToggleExpansion = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };
  
  // Gérer le marquage d'une configuration comme terminée
  const handleToggleConfigCompleted = (moduleId: number, completed: boolean) => {
    let updatedConfigCompleted;
    
    if (completed) {
      updatedConfigCompleted = [...configCompletedModules, moduleId];
    } else {
      updatedConfigCompleted = configCompletedModules.filter(id => id !== moduleId);
    }
    
    setConfigCompletedModules(updatedConfigCompleted);
    localStorage.setItem('configCompletedModules', JSON.stringify(updatedConfigCompleted));
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader />
        
        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 items-center w-full md:w-auto">
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="business">Gestion d'entreprise</SelectItem>
                  <SelectItem value="services">Services spécialisés</SelectItem>
                  <SelectItem value="digital">Présence numérique</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              title="Réinitialiser les filtres"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Liste des modules */}
        <ModuleList
          modules={filteredModules}
          installedModules={installedModules}
          expandedModule={expandedModule}
          configCompletedModules={configCompletedModules}
          onInstall={handleInstallModule}
          onUninstall={handleUninstallModule}
          onToggleExpansion={handleToggleExpansion}
          onToggleConfigCompleted={handleToggleConfigCompleted}
        />
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
