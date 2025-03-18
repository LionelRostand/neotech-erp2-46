
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { modules } from '@/data/modules';
import { AppModule, SubModule } from '@/data/types/modules';

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
        <CardHeader>
          <CardTitle>Sous-module non trouvé</CardTitle>
          <CardDescription>
            Le sous-module demandé n'existe pas ou n'est pas accessible.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{module.name} - {submodule.name}</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-neotech-primary">{submodule.icon}</span>
            <span>{submodule.name}</span>
          </CardTitle>
          <CardDescription>
            Fonctionnalité du module {module.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              {submodule.icon}
            </div>
            <h3 className="text-xl font-bold">Fonctionnalité en développement</h3>
            <p className="mt-2 text-gray-500">
              Cette fonctionnalité est actuellement en cours de développement.<br />
              Elle sera disponible prochainement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmodulePage;
