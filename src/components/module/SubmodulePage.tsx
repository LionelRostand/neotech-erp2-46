
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { modules } from '@/data/modules';
import { AppModule, SubModule } from '@/data/types/modules';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import DefaultSubmoduleContent from './submodules/DefaultSubmoduleContent';
import EmployeesBadges from './submodules/EmployeesBadges';
import FreightShipments from './submodules/FreightShipments';
import EmployeesDashboard from './submodules/EmployeesDashboard';
import FreightDashboard from './submodules/FreightDashboard';
import ConsultationsPage from './submodules/health/ConsultationsPage';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  const [module, setModule] = useState<AppModule | undefined>();
  const [submodule, setSubmodule] = useState<SubModule | undefined>();

  useEffect(() => {
    const foundModule = modules.find(m => m.id === moduleId);
    setModule(foundModule);
    
    if (foundModule?.submodules) {
      const foundSubmodule = foundModule.submodules.find(s => s.id === submoduleId);
      setSubmodule(foundSubmodule);
    }
  }, [moduleId, submoduleId]);

  if (!module || !submodule) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-bold">Sous-module non trouvé</h3>
            <p className="mt-2 text-gray-500">
              Le sous-module demandé n'existe pas ou n'est pas accessible.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderSubmoduleContent = () => {
    // Dashboard specific content
    if (submoduleId === 'employees-dashboard') {
      return <EmployeesDashboard />;
    }
    
    if (submoduleId === 'freight-dashboard') {
      return <FreightDashboard />;
    }
    
    // Specific content for employees-badges
    if (submoduleId === 'employees-badges') {
      return <EmployeesBadges />;
    }
    
    // Specific content for freight-shipments
    if (submoduleId === 'freight-shipments') {
      return <FreightShipments />;
    }
    
    // Health module specific content
    if (submoduleId === 'health-consultations') {
      return <ConsultationsPage />;
    }
    
    // Default content for other submodules
    return <DefaultSubmoduleContent submodule={submodule} />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{module.name} - {submodule.name}</h1>
      
      <Card className="shadow-md">
        <SubmoduleHeader module={module} submodule={submodule} />
        <CardContent className="pt-6">
          {renderSubmoduleContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmodulePage;
