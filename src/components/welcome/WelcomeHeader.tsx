
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WelcomeHeader = () => {
  const navigate = useNavigate();
  
  return (
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
          variant="outline"
          className="border-gray-300 text-gray-700 px-8 py-6 h-auto text-lg"
          size="lg"
          onClick={() => navigate('/module-info')}
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
  );
};

export default WelcomeHeader;
