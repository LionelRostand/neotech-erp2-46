
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '@/data/modules';

interface ModuleAnimationProps {
  installedModules: number[];
  visibleModules: number[];
  animationStep: number;
}

// Define an array of colors for modules
const moduleColors = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-rose-500',
];

const ModuleAnimation = ({ installedModules, visibleModules, animationStep }: ModuleAnimationProps) => {
  return (
    <motion.div 
      className="relative h-[500px] w-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <motion.div 
          className="w-24 h-24 rounded-full bg-neotech-primary flex items-center justify-center text-white text-4xl font-bold shadow-lg"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0],
            boxShadow: [
              '0 0 0px rgba(0,0,0,0)',
              '0 0 10px rgba(0,0,0,0.2)',
              '0 0 20px rgba(0,0,0,0.3)',
              '0 0 30px rgba(0,0,0,0.2)',
              '0 0 0px rgba(0,0,0,0)'
            ]
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
        {installedModules.length > 0 ? (
          visibleModules.map((moduleId, index) => {
            const module = modules.find(m => m.id === moduleId);
            if (!module) return null;
            
            const colorIndex = index % moduleColors.length;
            const angle = (index * (360 / visibleModules.length) + animationStep * 5) % 360;
            const radius = 180;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            
            return (
              <motion.div
                key={module.id}
                className={`absolute ${moduleColors[colorIndex]} p-4 rounded-xl shadow-lg flex flex-col items-center justify-center w-28 h-28`}
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
                <div className="mb-2 text-2xl text-white">
                  {module.icon}
                </div>
                <span className="text-sm font-medium text-white">{module.name}</span>
                <span className="text-xs mt-1 text-white/80">Installé</span>
              </motion.div>
            );
          })
        ) : (
          <div className="absolute text-center px-8 py-4 bg-white/80 rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg">Aucune application installée</p>
            <p className="text-sm mt-2">Utilisez le menu de navigation pour installer des applications</p>
          </div>
        )}
      </AnimatePresence>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-neotech-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-purple-500/5 rounded-full blur-xl"></div>
      </div>
    </motion.div>
  );
};

export default ModuleAnimation;
