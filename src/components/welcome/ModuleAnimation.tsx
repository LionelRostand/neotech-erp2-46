
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
  2: 'bg-gradient-to-br from-[#F97316] to-[#FEC6A1]',  // Orange gradient
  3: 'bg-gradient-to-br from-[#D946EF] to-[#9b87f5]',  // Magenta to purple
  4: 'bg-gradient-to-br from-[#33C3F0] to-[#0EA5E9]',  // Sky blue gradient
  5: 'bg-gradient-to-br from-[#FF6B6B] to-[#FFE066]',  // Red to yellow
  6: 'bg-gradient-to-br from-[#4CAF50] to-[#8BC34A]',  // Green shades
  7: 'bg-gradient-to-br from-[#FF9A8B] to-[#FF6B88]',  // Peach to pink
  8: 'bg-gradient-to-br from-[#7B61FF] to-[#00C6FB]',  // Purple to cyan
  9: 'bg-gradient-to-br from-[#FFA726] to-[#FFCC80]',  // Orange shades
  10: 'bg-gradient-to-br from-[#43A047] to-[#1DE9B6]', // Green to teal
  11: 'bg-gradient-to-br from-[#FF5722] to-[#FF8A65]', // Deep orange
  12: 'bg-gradient-to-br from-[#2196F3] to-[#00BCD4]', // Blue to cyan
  13: 'bg-gradient-to-br from-[#EC407A] to-[#FF8A80]', // Pink to coral
  14: 'bg-gradient-to-br from-[#AB47BC] to-[#7E57C2]', // Purple shades
  15: 'bg-gradient-to-br from-[#26A69A] to-[#4DB6AC]', // Teal shades
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
          className="w-24 h-24 rounded-full bg-gradient-to-br from-neotech-primary to-[#00b36b] flex items-center justify-center text-white text-4xl font-bold shadow-lg"
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
                <div className="mb-2 text-2xl text-white">
                  {module.icon}
                </div>
                <span className="text-sm font-medium text-white">{module.name}</span>
                <span className="text-xs mt-1 text-gray-100">Installé</span>
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
