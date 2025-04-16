
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '@/data/modules';

interface ModuleAnimationProps {
  installedModules: number[];
  visibleModules: number[];
  animationStep: number;
}

const moduleColors = {
  1: 'bg-[#8B5CF6]',        // Vivid Purple for primary
  2: 'bg-[#0EA5E9]',        // Ocean Blue for projects
  3: 'bg-[#F97316]',        // Bright Orange for CRM
  4: 'bg-[#D946EF]',        // Magenta Pink for employees
  5: 'bg-[#33C3F0]',        // Sky Blue for freight
  6: 'bg-[#1EAEDB]',        // Bright Blue for garage
  7: 'bg-[#6E59A5]',        // Tertiary Purple for transport
  8: 'bg-[#7E69AB]',        // Secondary Purple for health
  9: 'bg-[#FEC6A1]',        // Soft Orange for accounting
  10: 'bg-[#E5DEFF]',       // Soft Purple for ecommerce
  11: 'bg-[#D3E4FD]',       // Soft Blue for website
  12: 'bg-[#FFDEE2]',       // Soft Pink for rentals
  13: 'bg-[#FDE1D3]',       // Soft Peach for messages
  14: 'bg-[#F2FCE2]',       // Soft Green for events
  15: 'bg-[#FEF7CD]',       // Soft Yellow for library
};

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
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#D946EF] flex items-center justify-center text-gray-100 text-4xl font-bold shadow-lg"
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
        {installedModules.length > 0 ? (
          visibleModules.map((moduleId, index) => {
            const module = modules.find(m => m.id === moduleId);
            if (!module) return null;
            
            const angle = (index * (360 / visibleModules.length) + animationStep * 5) % 360;
            const radius = 180;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            
            return (
              <motion.div
                key={module.id}
                className={`absolute p-4 rounded-xl shadow-lg flex flex-col items-center justify-center w-28 h-28 backdrop-blur-sm ring-2 ring-gray-300/30 ${moduleColors[moduleId] || 'bg-gradient-to-br from-[#9b87f5] to-[#D946EF]'}`}
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
                <div className="mb-2 text-2xl text-gray-100">
                  {module.icon}
                </div>
                <span className="text-sm font-medium text-gray-100">{module.name}</span>
                <span className="text-xs mt-1 text-gray-200/90">Installé</span>
              </motion.div>
            );
          })
        ) : (
          <div className="absolute text-center px-8 py-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-sm">
            <p className="text-gray-200 text-lg">Aucune application installée</p>
            <p className="text-sm mt-2 text-gray-300">Utilisez le menu de navigation pour installer des applications</p>
          </div>
        )}
      </AnimatePresence>
      
      {/* Background decorative elements with enhanced gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl"></div>
      </div>
    </motion.div>
  );
};

export default ModuleAnimation;
