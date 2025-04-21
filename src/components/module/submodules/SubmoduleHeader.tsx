import React from 'react';
import { AppModule, SubModule } from '@/data/types/modules';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from 'lucide-react';

interface SubmoduleHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  module?: AppModule;
  submodule?: SubModule;
}

const SubmoduleHeader: React.FC<SubmoduleHeaderProps> = ({ 
  title, 
  description, 
  action,
  module,
  submodule 
}) => {
  if (module && submodule) {
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
  }
  
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle className="flex items-center gap-2">
          <span className="text-neotech-primary">
            {submodule?.icon || <Container className="h-5 w-5" />}
          </span>
          <span>{title}</span>
        </CardTitle>
        {description && (
          <CardDescription className="mt-1">
            {description}
          </CardDescription>
        )}
      </div>
      {action && (
        <div>
          {action}
        </div>
      )}
    </CardHeader>
  );
};

export default SubmoduleHeader;
