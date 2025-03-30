
import React from 'react';
import WebsiteModules from './components/WebsiteModules';

const WebsiteModulesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold">Modules intégrés</h2>
        <p className="text-muted-foreground">
          Gérez les modules intégrés à votre site Web
        </p>
      </div>
      
      <WebsiteModules />
    </div>
  );
};

export default WebsiteModulesPage;
