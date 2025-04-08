
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Download, Check, Trash2, Settings } from 'lucide-react';
import { modules } from '@/data/modules';
import { AppModule } from '@/data/types/modules';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Applications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  const [configCompletedModules, setConfigCompletedModules] = useState<number[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Catégories disponibles
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'business', name: 'Entreprise' },
    { id: 'services', name: 'Services' },
    { id: 'digital', name: 'Numérique' },
    { id: 'communication', name: 'Communication' }
  ];

  // Chargement des modules installés depuis localStorage
  useEffect(() => {
    const savedModules = localStorage.getItem('installedModules');
    const savedConfigModules = localStorage.getItem('configCompletedModules');
    
    if (savedModules) {
      setInstalledModules(JSON.parse(savedModules));
    }
    
    if (savedConfigModules) {
      setConfigCompletedModules(JSON.parse(savedConfigModules));
    }
  }, []);

  // Sauvegarde des modules installés dans localStorage
  const saveInstalledModules = (modules: number[]) => {
    localStorage.setItem('installedModules', JSON.stringify(modules));
    // Déclencher un événement pour informer les autres composants du changement
    window.dispatchEvent(new Event('modulesChanged'));
  };

  // Sauvegarde des modules avec configuration terminée
  const saveConfigCompletedModules = (modules: number[]) => {
    localStorage.setItem('configCompletedModules', JSON.stringify(modules));
  };

  // Gérer l'installation d'un module
  const handleInstallModule = (moduleId: number) => {
    const updatedModules = [...installedModules, moduleId];
    setInstalledModules(updatedModules);
    saveInstalledModules(updatedModules);
    
    const moduleInfo = modules.find(m => m.id === moduleId);
    
    toast({
      title: "Module installé",
      description: `Le module ${moduleInfo?.name} a été installé avec succès.`,
      variant: "default",
    });
  };

  // Gérer la désinstallation d'un module
  const handleUninstallModule = (moduleId: number) => {
    const updatedModules = installedModules.filter(id => id !== moduleId);
    setInstalledModules(updatedModules);
    saveInstalledModules(updatedModules);
    
    // Retirer également de la liste des configurations terminées si présent
    if (configCompletedModules.includes(moduleId)) {
      const updatedConfigModules = configCompletedModules.filter(id => id !== moduleId);
      setConfigCompletedModules(updatedConfigModules);
      saveConfigCompletedModules(updatedConfigModules);
    }
    
    const moduleInfo = modules.find(m => m.id === moduleId);
    
    toast({
      title: "Module désinstallé",
      description: `Le module ${moduleInfo?.name} a été désinstallé avec succès.`,
      variant: "default",
    });
  };

  // Gérer l'expansion/collapse d'un module
  const handleToggleExpansion = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Gérer le changement d'état de configuration
  const handleToggleConfigCompleted = (moduleId: number, completed: boolean) => {
    let updatedConfigModules;
    
    if (completed) {
      updatedConfigModules = [...configCompletedModules, moduleId];
    } else {
      updatedConfigModules = configCompletedModules.filter(id => id !== moduleId);
    }
    
    setConfigCompletedModules(updatedConfigModules);
    saveConfigCompletedModules(updatedConfigModules);
  };

  // Filtrer les modules en fonction de la recherche et de la catégorie
  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      activeCategory === 'all' || module.category === activeCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold mb-2">APPLICATIONS</h1>
          <p className="text-gray-600">
            Explorez et gérez les modules disponibles pour votre système NEOTECH-ERP. Installez les modules dont vous avez besoin et personnalisez votre expérience.
          </p>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-neotech-primary focus:ring-1 focus:ring-neotech-primary"
              />
            </div>
            
            {/* Onglets de catégorie */}
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-white text-neotech-primary shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sections de modules par catégorie */}
        <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* GESTION D'ENTREPRISE */}
          {(activeCategory === 'all' || activeCategory === 'business') && (
            <ModuleSection 
              title="GESTION D'ENTREPRISE"
              modules={filteredModules.filter(m => m.category === 'business')}
              installedModules={installedModules}
              configCompletedModules={configCompletedModules}
              expandedModule={expandedModule}
              onInstall={handleInstallModule}
              onUninstall={handleUninstallModule}
              onToggleExpansion={handleToggleExpansion}
              onToggleConfigCompleted={handleToggleConfigCompleted}
            />
          )}
          
          {/* SERVICES SPÉCIALISÉS */}
          {(activeCategory === 'all' || activeCategory === 'services') && (
            <ModuleSection 
              title="SERVICES SPÉCIALISÉS"
              modules={filteredModules.filter(m => m.category === 'services')}
              installedModules={installedModules}
              configCompletedModules={configCompletedModules}
              expandedModule={expandedModule}
              onInstall={handleInstallModule}
              onUninstall={handleUninstallModule}
              onToggleExpansion={handleToggleExpansion}
              onToggleConfigCompleted={handleToggleConfigCompleted}
            />
          )}
          
          {/* PRÉSENCE NUMÉRIQUE */}
          {(activeCategory === 'all' || activeCategory === 'digital') && (
            <ModuleSection 
              title="PRÉSENCE NUMÉRIQUE"
              modules={filteredModules.filter(m => m.category === 'digital')}
              installedModules={installedModules}
              configCompletedModules={configCompletedModules}
              expandedModule={expandedModule}
              onInstall={handleInstallModule}
              onUninstall={handleUninstallModule}
              onToggleExpansion={handleToggleExpansion}
              onToggleConfigCompleted={handleToggleConfigCompleted}
            />
          )}
          
          {/* COMMUNICATION */}
          {(activeCategory === 'all' || activeCategory === 'communication') && (
            <ModuleSection 
              title="COMMUNICATION"
              modules={filteredModules.filter(m => m.category === 'communication')}
              installedModules={installedModules}
              configCompletedModules={configCompletedModules}
              expandedModule={expandedModule}
              onInstall={handleInstallModule}
              onUninstall={handleUninstallModule}
              onToggleExpansion={handleToggleExpansion}
              onToggleConfigCompleted={handleToggleConfigCompleted}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Composant de section de modules
interface ModuleSectionProps {
  title: string;
  modules: AppModule[];
  installedModules: number[];
  configCompletedModules: number[];
  expandedModule: number | null;
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
  onToggleConfigCompleted: (moduleId: number, completed: boolean) => void;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({
  title,
  modules,
  installedModules,
  configCompletedModules,
  expandedModule,
  onInstall,
  onUninstall,
  onToggleExpansion,
  onToggleConfigCompleted
}) => {
  if (modules.length === 0) return null;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          {title}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            isInstalled={installedModules.includes(module.id)}
            isConfigCompleted={configCompletedModules.includes(module.id)}
            isExpanded={expandedModule === module.id}
            onInstall={onInstall}
            onUninstall={onUninstall}
            onToggleExpansion={onToggleExpansion}
            onToggleConfigCompleted={onToggleConfigCompleted}
          />
        ))}
      </div>
    </div>
  );
};

// Composant de carte de module
interface ModuleCardProps {
  module: AppModule;
  isInstalled: boolean;
  isConfigCompleted: boolean;
  isExpanded: boolean;
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
  onToggleConfigCompleted: (moduleId: number, completed: boolean) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isInstalled,
  isConfigCompleted,
  isExpanded,
  onInstall,
  onUninstall,
  onToggleExpansion,
  onToggleConfigCompleted
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="bg-gray-50 p-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-neotech-primary/10 rounded-md text-neotech-primary">
            {module.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{module.name}</h3>
            <p className="text-xs text-gray-500">Module #{module.id}</p>
          </div>
        </div>
        
        <div className="flex">
          {module.submodules && isInstalled && (
            <button 
              onClick={() => onToggleExpansion(module.id)}
              className="text-gray-500 hover:text-gray-700"
              disabled={isConfigCompleted}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
        
        {isInstalled && isExpanded && module.submodules && !isConfigCompleted && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-2">Fonctionnalités disponibles:</h4>
            <div className="grid grid-cols-1 gap-1.5">
              {module.submodules.map((submodule) => (
                <div key={submodule.id} className="flex items-center p-1.5 rounded-md bg-gray-50 hover:bg-gray-100">
                  <div className="mr-2 text-neotech-primary">
                    {submodule.icon}
                  </div>
                  <span className="text-xs font-medium">{submodule.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-100">
        {isInstalled ? (
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <div className="text-green-600 text-sm flex items-center">
              <Check className="mr-1 h-3 w-3" />
              <span>Installé</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600">Configuration terminée:</span>
                <Switch 
                  checked={isConfigCompleted} 
                  onCheckedChange={(checked) => onToggleConfigCompleted(module.id, checked)}
                  aria-label="Marquer la configuration comme terminée"
                />
              </div>
              
              {!isConfigCompleted && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
                  onClick={() => onUninstall(module.id)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Désinstaller
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onInstall(module.id)}
            className="hover:bg-neotech-primary hover:text-white"
          >
            <Download className="mr-1 h-3 w-3" />
            Installer
          </Button>
        )}
      </div>
    </div>
  );
};

export default Applications;
