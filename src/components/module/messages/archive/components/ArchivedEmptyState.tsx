
import React from 'react';

const ArchivedEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <p className="text-sm text-gray-500">
        Aucun message archivé trouvé
      </p>
    </div>
  );
};

export default ArchivedEmptyState;
