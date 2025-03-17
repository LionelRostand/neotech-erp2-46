import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppWindow } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '@/data/modules';

const Welcome = () => {
  const navigate = useNavigate();
  const [visibleModules, setVisibleModules] = useState<number[]>([1, 2, 3, 4]);
  const [animationStep, setAnimationStep] = useState(0);
  const [installedModules, setInstalledModules] = useState<number[]>([]);

  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
    };
    
    loadInstalledModules();
    
    window.addEventListener('modulesChanged', loadInstalledModules);
    return () => {
      window.removeEventListener('modulesChanged', loadInstalledModules);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        const nextStep = prev + 1;
        
        if (nextStep % 3 === 0) {
          let potentialModules = [...visibleModules];
          
          for (const installedId of installedModules) {
            if (!potentialModules.includes(installedId)) {
              potentialModules.push(installedId);
              setVisibleModules(potentialModules);
              return nextStep;
            }
          }
          
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
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column: Text and CTA */}
            <div className="flex flex-col items-start text-left space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block bg-neotech-primary/10 text-neotech-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                NEOTECH ERP System
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Optimisez votre entreprise avec notre suite complète
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Découvrez notre suite complète de modules pour optimiser la gestion de votre entreprise. Installation simple, configuration rapide, résultats immédiats.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  onClick={() => navigate('/applications')}
                  className="bg-neotech-primary hover:bg-neotech-primary/90 text-white px-8 py-6 h-auto text-lg"
                  size="lg"
                >
                  <AppWindow className="mr-2 h-5 w-5" />
                  Gérer les applications
                </Button>
                
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 px-8 py-6 h-auto text-lg"
                  size="lg"
                  onClick={() => navigate('/welcome')}
                >
                  En savoir plus
                </Button>
              </motion.div>
              
              <motion.div 
                className="pt-6 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">+200</span> entreprises utilisent déjà notre plateforme
                </p>
              </motion.div>
            </div>
            
            {/* Right column: Animated modules */}
            <motion.div 
              className="relative h-[500px] w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.div 
                  className="w-24 h-24 rounded-full bg-neotech-primary flex items-center justify-center text-white text-4xl font-bold shadow-lg"
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
                  N
                </motion.div>
              </div>
              
              <AnimatePresence>
                {visibleModules.map((moduleId, index) => {
                  const module = modules.find(m => m.id === moduleId);
                  if (!module) return null;
                  
                  const angle = (index * (360 / visibleModules.length) + animationStep * 5) % 360;
                  const radius = 180;
                  const x = radius * Math.cos(angle * Math.PI / 180);
                  const y = radius * Math.sin(angle * Math.PI / 180);
                  
                  const isInstalled = installedModules.includes(moduleId);
                  
                  return (
                    <motion.div
                      key={module.id}
                      className={`absolute top-1/2 left-1/2 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center w-28 h-28 ${
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
                      <div className={`mb-2 text-2xl ${isInstalled ? 'text-neotech-primary' : 'text-gray-600'}`}>
                        {module.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{module.name}</span>
                      {isInstalled && (
                        <span className="text-xs mt-1 text-neotech-primary">Installé</span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {/* Background decorative elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-neotech-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-purple-500/5 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { title: "Modules", value: `${modules.length}+` },
              { title: "Modules actifs", value: `${visibleModules.length}` },
              { title: "Modules installés", value: `${installedModules.length}` },
              { title: "Satisfaction", value: "98%" }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
              >
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Welcome;
