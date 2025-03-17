
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '@/data/appModules';

const Welcome = () => {
  const [visibleModules, setVisibleModules] = useState<number[]>([1, 2, 3, 4]);
  const [animationStep, setAnimationStep] = useState(0);
  const [installedModules, setInstalledModules] = useState<number[]>([]);

  // Charger les modules installés depuis le localStorage
  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
    };
    
    loadInstalledModules();
    
    // Écouter les changements d'installation
    window.addEventListener('modulesChanged', loadInstalledModules);
    return () => {
      window.removeEventListener('modulesChanged', loadInstalledModules);
    };
  }, []);

  // Animation cyclique qui montre prioritairement les modules installés
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        const nextStep = prev + 1;
        
        // Ajouter progressivement plus de modules
        if (nextStep % 3 === 0) {
          // Priorité aux modules installés
          let potentialModules = [...visibleModules];
          
          // Ajouter les modules installés d'abord s'ils ne sont pas déjà visibles
          for (const installedId of installedModules) {
            if (!potentialModules.includes(installedId)) {
              potentialModules.push(installedId);
              setVisibleModules(potentialModules);
              return nextStep;
            }
          }
          
          // Ensuite ajouter d'autres modules si nécessaire
          const nextModuleId = Math.min(modules.length, potentialModules.length + 1);
          if (nextModuleId > potentialModules.length) {
            setVisibleModules([...potentialModules, nextModuleId]);
          }
        }
        
        return nextStep;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [visibleModules, installedModules]);

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-neotech-primary mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BIENVENUE SUR NEOTECH-CONSULTING
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Découvrez notre suite complète de modules pour optimiser votre entreprise
        </motion.p>
        
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Orbit animation */}
          <div className="relative h-[400px] w-[400px] mx-auto">
            {/* Centre de l'orbite - Logo NEOTECH */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="w-20 h-20 rounded-full bg-neotech-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                N
              </div>
            </motion.div>
            
            {/* Modules en orbite */}
            <AnimatePresence>
              {visibleModules.map((moduleId, index) => {
                const module = modules.find(m => m.id === moduleId);
                if (!module) return null;
                
                // Calculer la position sur l'orbite
                const angle = (index * (360 / visibleModules.length) + animationStep * 5) % 360;
                const radius = 150; // Rayon de l'orbite
                const x = radius * Math.cos(angle * Math.PI / 180);
                const y = radius * Math.sin(angle * Math.PI / 180);
                
                // Vérifier si le module est installé pour lui donner un style différent
                const isInstalled = installedModules.includes(moduleId);
                
                return (
                  <motion.div
                    key={module.id}
                    className={`absolute top-1/2 left-1/2 bg-white p-3 rounded-xl shadow-md flex flex-col items-center justify-center w-24 h-24 ${
                      isInstalled ? 'ring-2 ring-neotech-primary' : ''
                    }`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: x,
                      y: y,
                      zIndex: Math.round(Math.sin(angle * Math.PI / 180) * 10) + 10
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      duration: 0.8,
                      x: { duration: 2 },
                      y: { duration: 2 }
                    }}
                  >
                    <div className={`mb-1 ${isInstalled ? 'text-neotech-primary' : 'text-gray-600'}`}>
                      {module.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{module.name}</span>
                    {isInstalled && (
                      <span className="text-[10px] text-neotech-primary">Installé</span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        
        <motion.div 
          className="mt-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p>Modules actifs: {visibleModules.length} / {modules.length}</p>
          <p className="text-sm mt-2">
            Modules installés: {installedModules.length} / {modules.length}
          </p>
          <motion.div
            className="mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/applications')}
              className="bg-neotech-primary hover:bg-neotech-primary/90"
            >
              <AppWindow className="mr-2 h-4 w-4" />
              Gérer les applications
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Welcome;
