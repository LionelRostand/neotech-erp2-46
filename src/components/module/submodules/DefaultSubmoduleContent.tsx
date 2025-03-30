
import React from 'react';
import { SubModule } from '@/data/types/modules';

interface DefaultSubmoduleContentProps {
  submodule: SubModule;
}

const DefaultSubmoduleContent: React.FC<DefaultSubmoduleContentProps> = ({ submodule }) => {
  return (
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
  );
};

export default DefaultSubmoduleContent;
