
import React from 'react';

const EmptyTimeReports: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <p className="text-gray-500 text-lg">Aucun rapport d'activité trouvé</p>
    </div>
  );
};

export default EmptyTimeReports;
