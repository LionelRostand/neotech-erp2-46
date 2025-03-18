
import React from 'react';
import { AppModule, SubModule } from '@/data/types/modules';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SubmoduleHeaderProps {
  module: AppModule;
  submodule: SubModule;
}

const SubmoduleHeader: React.FC<SubmoduleHeaderProps> = ({ module, submodule }) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span className="text-neotech-primary">{submodule.icon}</span>
        <span>{submodule.name}</span>
      </CardTitle>
      <CardDescription>
        Fonctionnalité du module {module.name}
      </CardDescription>
    </CardHeader>
  );
};

export default SubmoduleHeader;
