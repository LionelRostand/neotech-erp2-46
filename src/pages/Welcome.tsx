
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import WelcomeHeader from '@/components/welcome/WelcomeHeader';
import ModuleAnimation from '@/components/welcome/ModuleAnimation';
import StatisticsSection from '@/components/welcome/StatisticsSection';
import { modules } from '@/data/modules';

const Welcome = () => {
  const [visibleModules, setVisibleModules] = useState<number[]>([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [installedModules, setInstalledModules] = useState<number[]>([]);

  useEffect(() => {
    const loadInstalledModules = () => {
      const savedModules = localStorage.getItem('installedModules');
      if (savedModules) {
        const parsedModules = JSON.parse(savedModules);
        setInstalledModules(parsedModules);
        setVisibleModules(parsedModules);
      }
    };
    
    loadInstalledModules();
    
    window.addEventListener('modulesChanged', loadInstalledModules);
    return () => {
      window.removeEventListener('modulesChanged', loadInstalledModules);
    };
  }, []);

  useEffect(() => {
    if (installedModules.length === 0) return;
    
    const interval = setInterval(() => {
      setAnimationStep(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [installedModules]);

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column: Text and CTA */}
            <WelcomeHeader />
            
            {/* Right column: Animated modules */}
            <ModuleAnimation 
              installedModules={installedModules}
              visibleModules={visibleModules}
              animationStep={animationStep}
            />
          </div>
          
          <StatisticsSection 
            installedModules={installedModules}
            visibleModules={visibleModules}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Welcome;
