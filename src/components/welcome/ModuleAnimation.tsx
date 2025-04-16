
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '@/data/modules';

interface ModuleAnimationProps {
  installedModules: number[];
  visibleModules: number[];
  animationStep: number;
}

const moduleColors = {
  1: 'bg-gradient-to-br from-[#8B5CF6] to-[#6E59A5]',  // Vibrant purple gradient
  2: 'bg-gradient-to-br from-[#0EA5E9] to-[#1EAEDB]',  // Ocean blue gradient
  3: 'bg-gradient-to-br from-[#F97316] to-[#FEC6A1]',  // Orange gradient
  4: 'bg-gradient-to-br from-[#D946EF] to-[#9b87f5]',  // Magenta to purple
  5: 'bg-gradient-to-br from-[#33C3F0] to-[#0EA5E9]',  // Sky blue gradient
  6: 'bg-gradient-to-br from-[#7E69AB] to-[#6E59A5]',  // Deep purple gradient
  7: 'bg-gradient-to-br from-[#F97316] to-[#FDE1D3]',  // Warm orange gradient
  8: 'bg-gradient-to-br from-[#D946EF] to-[#E5DEFF]',  // Pink to soft purple
  9: 'bg-gradient-to-br from-[#8B5CF6] to-[#D3E4FD]',  // Purple to soft blue
  10: 'bg-gradient-to-br from-[#1EAEDB] to-[#33C3F0]', // Blue gradient
  11: 'bg-gradient-to-br from-[#F97316] to-[#FEF7CD]', // Orange to yellow
  12: 'bg-gradient-to-br from-[#6E59A5] to-[#9b87f5]', // Purple variation
  13: 'bg-gradient-to-br from-[#0EA5E9] to-[#D3E4FD]', // Ocean to soft blue
  14: 'bg-gradient-to-br from-[#D946EF] to-[#FDE1D3]', // Magenta to peach
  15: 'bg-gradient-to-br from-[#33C3F0] to-[#E5DEFF]', // Sky blue to lavender
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
          className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
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
                <div className="mb-2 text-2xl text-gray-900">
                  {module.icon}
                </div>
                <span className="text-sm font-medium text-gray-900">{module.name}</span>
                <span className="text-xs mt-1 text-gray-800">Installé</span>
              </motion.div>
            );
          })
        ) : (
          <div className="absolute text-center px-8 py-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-sm">
            <p className="text-gray-200 text-lg">Aucune application installée</p>
            <p className="text-sm mt-2 text-gray-300">Utilisez le menu de navigation pour installer des applications</p>
          </div>
        )}
      </AnimatePresence>
      
      {/* Background decorative elements with enhanced gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-[#8B5CF6]/30 to-[#D946EF]/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-[#0EA5E9]/30 to-[#33C3F0]/30 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-gradient-to-br from-[#F97316]/30 to-[#FEC6A1]/30 rounded-full blur-xl"></div>
      </div>
    </motion.div>
  );
};

export default ModuleAnimation;
