
import React from 'react';
import { motion } from 'framer-motion';
import { modules } from '@/data/modules';

interface StatisticsSectionProps {
  installedModules: number[];
  visibleModules: number[];
}

const StatisticsSection = ({ installedModules, visibleModules }: StatisticsSectionProps) => {
  return (
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
  );
};

export default StatisticsSection;
